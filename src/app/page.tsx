import { UserAuth } from "@/components/user-auth";
import { Counter } from "@/components/counter";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <header className="flex w-full items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-foreground">ClickSync</h1>
        <UserAuth />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-12 p-4 text-center md:p-24">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
            One Button, One Universe
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Join thousands of users in a collaborative clicking experiment. Every
            click matters.
          </p>
        </div>
        <Counter />
      </main>
      <footer className="w-full p-4 text-center text-sm text-muted-foreground">
        <p>Built with Next.js & Firebase</p>
      </footer>
    </div>
  );
}
