import { Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

// Versione semplificata che non richiede più autenticazione
// Ora tutte le rotte sono accessibili senza login
export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  return (
    <Route path={path}>
      {(params) => <Component {...params} />}
    </Route>
  );
}