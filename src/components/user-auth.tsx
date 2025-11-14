
"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoogleIcon } from "@/components/icons";
import { useFirebase } from "@/firebase";

export function UserAuth() {
  const { user, auth } = useFirebase();
  const { toast } = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (!auth) return;
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      let description = "Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/popup-blocked') {
        description = "El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para este sitio e inténtalo de nuevo.";
      } else if (error.code === 'auth/unauthorized-domain') {
        description = "Este dominio no está autorizado para iniciar sesión. Por favor, añádelo a la configuración de tu proyecto de Firebase.";
      }
      toast({
        title: "Fallo al Iniciar Sesión",
        description: description,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      if (!auth) return;
      await signOut(auth);
    } catch (error: any) {
      console.error("Error signing out: ", error);
      toast({
        title: "Fallo al Cerrar Sesión",
        description: error.message || "Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? "User"} />
              <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleSignIn} variant="outline">
      <GoogleIcon className="mr-2 h-4 w-4" />
      Iniciar sesión con Google
    </Button>
  );
}
