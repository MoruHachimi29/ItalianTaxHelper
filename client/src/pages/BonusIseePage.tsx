import { Helmet } from "react-helmet";
import Layout from "@/components/Layout";
import BonusIseeTracker from "@/components/utilities/BonusIseeTracker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function BonusIseePage() {
  return (
    <Layout>
      <Helmet>
        <title>Bonus ISEE 2025 | F24Editabile</title>
        <meta name="description" content="Esplora i Bonus ISEE 2025 disponibili per i cittadini italiani. Scopri a quali contributi potresti avere diritto in base al tuo ISEE e alla tua situazione familiare." />
        <meta name="keywords" content="bonus ISEE 2025, agevolazioni fiscali, sussidi famiglie, assegno unico, bonus casa, carta dedicata, contributi 2025" />
      </Helmet>

      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-2">Bonus ISEE 2025</h1>
        <p className="text-center text-gray-600 mb-6">
          Scopri tutti i bonus e le agevolazioni disponibili in base al tuo ISEE
        </p>

        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            I dati sui bonus sono aggiornati al 16 aprile 2025. Verifica sempre le informazioni sui siti ufficiali degli enti erogatori prima di presentare domanda.
          </AlertDescription>
        </Alert>

        <BonusIseeTracker />
      </div>
    </Layout>
  );
}