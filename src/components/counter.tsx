
"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot, setDoc, increment, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, RotateCcw } from "lucide-react";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";
import { ProgressCircle } from "@/components/progress-circle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Counter() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const counterDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid, "counters", "user_counter");
  }, [firestore, user]);

  useEffect(() => {
    if (!counterDocRef) {
      setCount(0);
      return;
    }

    const unsubscribe = onSnapshot(
      counterDocRef,
      (docSnap) => {
        const currentCount = docSnap.exists() ? docSnap.data().value : 0;
        setCount(currentCount);
      },
      (error) => {
        if (!counterDocRef) return;
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: counterDocRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({
          title: "Error de Conexión",
          description: "No se pudo conectar a tu contador.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [counterDocRef, toast, user]);

  const handleIncrement = useCallback(() => {
    if (!user || !counterDocRef) {
      toast({
        title: "Autenticación Requerida",
        description: "Debes iniciar sesión para pulsar el botón.",
      });
      return;
    }

    setLoading(true);
    const newCount = (count ?? 0) + 1;
    if (newCount > 0 && newCount % 20 === 0) {
      toast({
        title: "¡Nivel Superado!",
        description: `¡Has alcanzado ${newCount} clics! Sigue así.`,
      });
    }

    const data = { value: increment(1), updatedAt: serverTimestamp() };
    
    setDoc(counterDocRef, data, { merge: true })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: counterDocRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 300);
      });
  }, [user, counterDocRef, toast, count]);

  const handleReset = () => {
    if (!user || !firestore || !counterDocRef || count === null) {
      toast({
        title: "Autenticación Requerida",
        description: "Debes iniciar sesión para reiniciar el contador.",
      });
      return;
    }

    // Save reset log
    const resetsColRef = collection(firestore, "users", user.uid, "resets");
    const resetLogData = {
      resetAtValue: count,
      timestamp: serverTimestamp()
    };
    addDoc(resetsColRef, resetLogData)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: resetsColRef.path,
        operation: 'create',
        requestResourceData: resetLogData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    // Reset counter
    const counterData = { value: 0, updatedAt: serverTimestamp() };
    setDoc(counterDocRef, counterData, { merge: true })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: counterDocRef.path,
          operation: 'update',
          requestResourceData: counterData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };
  
  const progress = count !== null ? count % 20 : 0;

  return (
     <div className="flex flex-col items-center gap-8">
        <div className="relative flex flex-col items-center gap-4">
          <ProgressCircle progress={progress} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <h2 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
              La Super Plataforma de Clics
            </h2>
            <p className="max-w-[700px] text-lg text-muted-foreground mt-2">
              Cada clic es una victoria. Demuestra tu poder.
            </p>
          </div>
        </div>

        <Card className="w-full max-w-sm text-center shadow-2xl bg-card/80 backdrop-blur-sm z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Tu Puntuación Universal</CardTitle>
            <CardDescription>Este es tu contador de poder personal.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="font-black text-primary transition-all text-8xl md:text-9xl">
              {count !== null ? (
                <span className="tabular-nums">{count.toLocaleString()}</span>
              ) : (
                <div className="h-[96px] w-[180px] animate-pulse rounded-lg bg-muted-foreground/20 md:h-[115px]" />
              )}
            </div>
            <div className="flex flex-col w-full gap-2">
              <Button
                onClick={handleIncrement}
                disabled={loading || !user}
                className="w-full transform rounded-xl py-6 text-lg font-bold transition-transform duration-100 ease-in-out active:scale-95"
              >
                {user ? (loading ? '...' : '¡Incrementar Poder!') : <><Lock className="mr-2" /> Inicia sesión para pulsar</>}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={!user}>
                    <RotateCcw />
                    Reiniciar Contador
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto reiniciará permanentemente tu contador de clics a 0.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
