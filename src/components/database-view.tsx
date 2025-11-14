
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
    return query(collectionGroup(firestore, 'counters'));
  }, [firestore]);

  const { data: counters, isLoading, error } = useCollection<CounterData>(countersQuery, !!firestore);

  const sortedCounters = useMemo(() => {
    if (!counters) return [];
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
          <AlertTitle>Error de Consulta</AlertTitle>
          <AlertDescription>
            No se pudieron obtener los datos de Firestore. Revisa las reglas de seguridad y la consola para ver errores.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!counters || counters.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-4">No se encontraron contadores. ¡Empieza a pulsar!</p>;
    }

    return (
      <ScrollArea className="h-72 w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead className="w-[150px]">ID de Usuario</TableHead>
              <TableHead className="text-right">Clics</TableHead>
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
            Vista de la Base de Datos en Vivo
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Card className="w-full mt-2 shadow-inner bg-card/50">
          <CardHeader>
            <CardTitle>Contadores de Todos los Usuarios</CardTitle>
            <CardDescription>
              Esta es una vista en tiempo real de todos los contadores de clics almacenados en la base de datos.
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
