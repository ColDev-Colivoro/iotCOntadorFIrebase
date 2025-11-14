
'use client';

import { useMemoFirebase } from '@/firebase/provider';
import { useCollection, useFirestore } from '@/firebase';
import { collectionGroup, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from './ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { useMemo } from 'react';


interface CounterData {
  value: number;
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

export function DatabaseView() {
  const firestore = useFirestore();

  const countersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query the 'counters' collection group to get all counters from all users.
    return query(collectionGroup(firestore, 'counters'));
  }, [firestore]);

  const { data: counters, isLoading, error } = useCollection<CounterData>(countersQuery, !!firestore);

  const sortedCounters = useMemo(() => {
    if (!counters) return [];
    // Sort counters by value in descending order
    return [...counters].sort((a, b) => b.value - a.value);
  }, [counters]);

  const renderContent = () => {
    if (isLoading) {
      return (
         <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
        </div>
      );
    }

    if (error) {
       return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Query Error</AlertTitle>
          <AlertDescription>
            Could not fetch data from Firestore. Check security rules and console for errors.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!counters || counters.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-4">No counters found. Start clicking!</p>;
    }

    return (
      <ScrollArea className="h-72 w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead className="w-[150px]">User ID</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCounters.map((counter, index) => (
              <TableRow key={`${counter.id}-${index}`}>
                <TableCell className="font-mono text-xs truncate">...{counter.id.slice(-12)}</TableCell>
                <TableCell className="text-right font-bold">{counter.value.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };
  
  return (
    <Collapsible className="w-full max-w-2xl">
      <div className="flex items-center justify-center">
        <CollapsibleTrigger asChild>
          <Button variant="ghost">
            <ChevronsUpDown className="w-4 h-4 mr-2" />
            Live Database View
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Card className="w-full mt-2 shadow-inner bg-card/50">
          <CardHeader>
            <CardTitle>All User Counters</CardTitle>
            <CardDescription>
              This is a live view of all click counts stored in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
