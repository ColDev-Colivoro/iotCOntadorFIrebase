"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const COUNTER_DOC_PATH = "counters/main_counter";

export function Counter() {
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const docRef = doc(db, COUNTER_DOC_PATH);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCount(docSnap.data().value);
        } else {
          // If the document doesn't exist, initialize it.
          setCount(0);
          setDoc(docRef, { value: 0 });
        }
      },
      (error) => {
        console.error("Error listening to counter:", error);
        toast({
          title: "Connection Error",
          description: "Could not connect to the database.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleIncrement = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to click the button.",
      });
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, COUNTER_DOC_PATH);
      await setDoc(docRef, { value: increment(1) }, { merge: true });
    } catch (error) {
      console.error("Error incrementing counter:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the counter. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Add a small delay to prevent spamming
      setTimeout(() => setLoading(false), 300);
    }
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
          className="w-full transform rounded-xl py-6 text-lg font-bold transition-transform duration-150 ease-in-out active:scale-95"
        >
          {user ? (loading ? '...' : 'Click Me!') : <><Lock className="mr-2" /> Sign in to Click</>}
        </Button>
      </CardContent>
    </Card>
  );
}
