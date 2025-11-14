
"use client";

import { useState, useEffect, useMemo } from "react";
import { doc, onSnapshot, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

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
      setCount(0); // If no user, show 0
      return;
    }

    const unsubscribe = onSnapshot(
      counterDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCount(docSnap.data().value);
        } else {
          setCount(0);
        }
      },
      (error) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: counterDocRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({
          title: "Connection Error",
          description: "Could not connect to your counter.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [counterDocRef, toast]);

  const handleIncrement = () => {
    if (!user || !counterDocRef) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to click the button.",
      });
      return;
    }

    setLoading(true);
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
  };

  return (
    <Card className="w-full max-w-sm text-center shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Your Click Count</CardTitle>
        <CardDescription>This is your personal click counter.</CardDescription>
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
