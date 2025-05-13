import { createContext, ReactNode, useContext } from "react";

// Definisce l'interfaccia per l'oggetto utente (semplificata)
interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
}

// Interfaccia semplificata per il contesto di autenticazione
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

// Crea un valore di default per il contesto
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  error: null
};

// Crea il contesto per l'autenticazione
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook per utilizzare il contesto di autenticazione
export function useAuth() {
  return useContext(AuthContext);
}

// Componente provider per l'autenticazione - versione semplificata senza database
export function AuthProvider({ children }: { children: ReactNode }) {
  // Versione semplificata che restituisce sempre null per l'utente
  // poiché abbiamo rimosso la funzionalità di login
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: false,
        error: null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}