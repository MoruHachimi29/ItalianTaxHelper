import { Helmet } from "react-helmet";
import TaxDeadlinesTracker from "@/components/utilities/TaxDeadlinesTracker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function TaxDeadlinesPage() {
  return (
    <>
      <Helmet>
        <title>Scadenze Fiscali 2025 | F24Editabile</title>
        <meta name="description" content="Monitora le scadenze fiscali 2025 per persone fisiche e giuridiche. Calendario aggiornato di dichiarazioni, versamenti e adempimenti fiscali." />
        <meta name="keywords" content="scadenze fiscali 2025, calendario fiscale, scadenze dichiarazione redditi, scadenze IVA, scadenze IRAP, versamenti fiscali, tasse Italia" />
      </Helmet>

      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-2">Scadenze Fiscali 2025</h1>
        <p className="text-center text-gray-600 mb-6">
          Monitora tutte le scadenze fiscali per persone fisiche e giuridiche
        </p>

        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            I dati sulle scadenze fiscali sono aggiornati al 16 aprile 2025. Potrebbero esserci variazioni in base a proroghe o modifiche normative. Verifica sempre le informazioni sui siti ufficiali degli enti competenti.
          </AlertDescription>
        </Alert>

        <TaxDeadlinesTracker />
      </div>
    </>
  );
}