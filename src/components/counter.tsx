
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, increment } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

const COUNTER_DOC_PATH = "counters/main_counter";

export function Counter() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;
    const docRef = doc(firestore, COUNTER_DOC_PATH);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCount(docSnap.data().value);
        } else {
          // The document doesn't exist, so we show 0.
          // A user's first click will create it.
          setCount(0);
        }
      },
      (error) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: docRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({
          title: "Connection Error",
          description: "Could not connect to the database.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [firestore, toast]);

  const handleIncrement = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to click the button.",
      });
      return;
    }

    if (!firestore) return;

    setLoading(true);
    const docRef = doc(firestore, COUNTER_DOC_PATH);
    const data = { value: increment(1) };
    
    setDoc(docRef, data, { merge: true })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        // Add a small delay to prevent spamming
        setTimeout(() => setLoading(false), 300);
      });
  };

  return (
    <Card className="w-full max-w-sm text-center shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Global Click Count</CardTitle>
        <CardDescription>This counter updates in real-time for everyone.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="font-black text-primary transition-all text-8xl md:text-9xl">
          {count !== null ? (
            <span className="tabular-nums">{count.toLocaleString()}</span>
          ) : (
            <div className="h-[96px] w-[180px] animate-pulse rounded-lg bg-muted-foreground/20 md:h-[115px]" />
          )}
        </div>
        <Button
          onClick={handleIncrement}
          disabled={loading || !user}
          className="w-full transform rounded-xl py-6 text-lg font-bold transition-transform duration-100 ease-in-out active:scale-95"
        >
          {user ? (loading ? '...' : 'Click Me!') : <><Lock className="mr-2" /> Sign in to Click</>}
        </Button>
      </CardContent>
    </Card>
  );
}
