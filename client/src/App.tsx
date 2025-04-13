import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import FormPage from "@/pages/FormPage";
import ModulesPage from "@/pages/ModulesPage";
import TutorialsPage from "@/pages/TutorialsPage";
import NewsPage from "@/pages/NewsPage";
import ContactPage from "@/pages/ContactPage";
import UtilitiesPage from "@/pages/UtilitiesPage";
import CurrencyConverterPage from "@/pages/CurrencyConverterPage";
import DutyCalculatorPage from "@/pages/DutyCalculatorPage";
import P7mConverterPage from "@/pages/P7mConverterPage";
import XmlToPngConverterPage from "@/pages/XmlToPngConverterPage";
import PdfEditorPage from "@/pages/PdfEditorPage";
import PdfToWordConverterPage from "@/pages/PdfToWordConverterPage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/moduli" component={ModulesPage} />
        <Route path="/moduli/:formType" component={FormPage} />
        <Route path="/tutorial" component={TutorialsPage} />
        <Route path="/notizie" component={NewsPage} />
        <Route path="/strumenti" component={UtilitiesPage} />
        <Route path="/strumenti/valuta" component={CurrencyConverterPage} />
        <Route path="/strumenti/dazi" component={DutyCalculatorPage} />
        <Route path="/strumenti/p7m" component={P7mConverterPage} />
        <Route path="/strumenti/xml-png" component={XmlToPngConverterPage} />
        <Route path="/strumenti/pdf-editor" component={PdfEditorPage} />
        <Route path="/strumenti/pdf-word" component={PdfToWordConverterPage} />
        <Route path="/contatti" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
