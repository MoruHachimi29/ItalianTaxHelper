import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, getGoogleAuthResult, type FirebaseUser } from "@/lib/firebase";
import { UserCredential } from "firebase/auth";

// Definisce l'interfaccia per l'oggetto utente
interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
}

// Definisce l'interfaccia per i dati di login
interface LoginData {
  username: string;
  password: string;
}

// Definisce l'interfaccia per i dati di registrazione
interface RegisterData extends LoginData {
  email?: string;
  fullName?: string;
}

// Interfaccia per i dati dell'autenticazione Google
interface GoogleAuthData {
  username: string;
  email: string;
  fullName?: string;
}

// Definisce il tipo di contesto per l'autenticazione
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  googleAuthMutation: UseMutationResult<User, Error, void>;
}

// Crea un valore di default per il contesto (evita warning)
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  error: null,
  loginMutation: {} as UseMutationResult<User, Error, LoginData>,
  logoutMutation: {} as UseMutationResult<void, Error, void>,
  registerMutation: {} as UseMutationResult<User, Error, RegisterData>,
  googleAuthMutation: {} as UseMutationResult<User, Error, void>
};

// Crea il contesto per l'autenticazione
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook per utilizzare il contesto di autenticazione
export function useAuth() {
  return useContext(AuthContext);
}

// Componente provider per l'autenticazione
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Query per ottenere i dati dell'utente corrente
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (!res.ok) {
          if (res.status === 401) {
            return null;
          }
          throw new Error("Errore nel recupero dei dati utente");
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
  });

  // Mutation per il login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante il login");
      }
      return await res.json();
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Login effettuato",
        description: `Benvenuto, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation per la registrazione
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la registrazione");
      }
      return await res.json();
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Registrazione completata",
        description: `Benvenuto in F24Editabile, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di registrazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation per il logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante il logout");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Funzione per gestire l'autenticazione Google completa
  const handleGoogleAuth = async (credential: UserCredential) => {
    if (!credential || !credential.user) {
      throw new Error("Dati utente Google non disponibili");
    }
    
    // Adattiamo il risultato al nostro tipo FirebaseUser
    const firebaseUser: FirebaseUser = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL
    };
    
    if (!firebaseUser.email) {
      throw new Error("Email utente Google non disponibile");
    }
    
    // Prepara i dati per l'autenticazione sul server
    const googleAuthData: GoogleAuthData = {
      username: firebaseUser.email.split('@')[0] + '_google', // Crea username dall'email
      email: firebaseUser.email,
      fullName: firebaseUser.displayName || undefined
    };
    
    // Invia i dati al nostro server
    const res = await apiRequest("POST", "/api/auth/google", googleAuthData);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Errore durante l'autenticazione con Google");
    }
    
    return await res.json();
  };
  
  // Controlla se c'è un risultato dall'autenticazione Google al caricamento dell'applicazione
  useEffect(() => {
    const checkGoogleRedirect = async () => {
      try {
        const result = await getGoogleAuthResult();
        if (result && result.user) {
          // Abbiamo un risultato di autenticazione con successo
          const userData = await handleGoogleAuth(result);
          // Aggiorna lo stato dell'utente
          queryClient.setQueryData(["/api/user"], userData);
          
          // Mostra un toast di benvenuto
          toast({
            title: "Accesso con Google completato",
            description: `Benvenuto, ${userData.username}!`,
          });
        }
      } catch (error) {
        console.error("Errore durante la verifica del redirect Google:", error);
        toast({
          title: "Errore di autenticazione Google",
          description: error instanceof Error ? error.message : "Errore durante l'autenticazione con Google",
          variant: "destructive",
        });
      }
    };
    
    // Esegui il controllo solo se l'utente non è già autenticato
    if (!user) {
      checkGoogleRedirect();
    }
  }, []);
  
  // Mutation per l'autenticazione tramite Google
  const googleAuthMutation = useMutation({
    mutationFn: async () => {
      try {
        // Avvia il processo di redirect di Firebase
        await signInWithGoogle();
        // Questo metodo fa un redirect e non restituisce un risultato direttamente
        // Il risultato verrà gestito in useEffect quando l'utente ritorna all'app
        return {} as User; // Restituisci un oggetto vuoto, verrà ignorato perché il redirect avviene prima
      } catch (error) {
        console.error("Errore durante l'autenticazione con Google:", error);
        throw error;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di autenticazione Google",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        googleAuthMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}