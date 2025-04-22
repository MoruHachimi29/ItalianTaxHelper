import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

// Definisce il tipo di contesto per l'autenticazione
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

// Crea il contesto per l'autenticazione
export const AuthContext = createContext<AuthContextType | null>(null);

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

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook per utilizzare il contesto di autenticazione
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere utilizzato all'interno di un AuthProvider");
  }
  return context;
}