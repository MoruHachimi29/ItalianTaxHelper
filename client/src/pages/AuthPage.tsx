import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthPage() {
  const { user } = useAuth();

  // Reindirizza alla home se l'utente è già autenticato
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Funzionalità di login disabilitata | F24Editabile</title>
        <meta name="description" content="La funzionalità di login è stata temporaneamente disabilitata su F24Editabile." />
      </Helmet>

      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Funzionalità di login disabilitata</h1>
          
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Funzionalità non disponibile</AlertTitle>
            <AlertDescription>
              La funzionalità di login è stata temporaneamente disabilitata. Puoi continuare a utilizzare F24Editabile senza effettuare l'accesso.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Informazioni su F24Editabile</CardTitle>
              <CardDescription>
                F24Editabile è il tuo strumento online per la compilazione dei moduli fiscali
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Funzionalità disponibili senza login:</h2>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Compilazione di moduli F24 (ordinario, semplificato, accise, elide)</li>
                  <li>Visualizzazione dei tutorial e guide sulla compilazione</li>
                  <li>Accesso a tutti gli strumenti di calcolo e conversione</li>
                  <li>Salvataggio locale dei moduli compilati</li>
                  <li>Consultazione delle scadenze fiscali e dei bonus disponibili</li>
                </ul>
              </div>
              
              <Button className="w-full" onClick={() => window.location.href = "/"}>
                Torna alla Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}