
'use client';
import { UserAuth } from "@/components/user-auth";
import { Counter } from "@/components/counter";
import { DatabaseView } from "@/components/database-view";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <header className="flex w-full items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-foreground">ClickSync</h1>
        <UserAuth />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-12 p-4 text-center md:p-24 w-full">
        <Counter />
        <Separator className="my-4 md:my-8 max-w-md" />
        <DatabaseView />
      </main>
      <footer className="w-full p-4 text-center text-sm text-muted-foreground">
      </footer>
    </div>
  );
}
