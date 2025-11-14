
import { UserAuth } from "@/components/user-auth";
import { Counter } from "@/components/counter";
import { DatabaseView } from "@/components/database-view";
import { Separator } from "@/components/ui/separator";


function CircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <header className="flex w-full items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-foreground">ClickSync</h1>
        <UserAuth />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-12 p-4 text-center md:p-24 w-full">
        <div className="flex flex-col items-center gap-4">
          <CircleIcon className="w-32 h-32 text-foreground" />
          <h2 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
            Un Botón, Un Universo
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Únete a miles de usuarios en un experimento de clics colaborativo. Cada
            clic importa.
          </p>
        </div>
        <Counter />
        <Separator className="my-4 md:my-8 max-w-md" />
        <DatabaseView />
      </main>
      <footer className="w-full p-4 text-center text-sm text-muted-foreground">
      </footer>
    </div>
  );
}
