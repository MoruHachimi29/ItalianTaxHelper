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
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import UtilitiesPage from "@/pages/UtilitiesPage";
import CurrencyConverterPage from "@/pages/CurrencyConverterPage";
import DutyCalculatorPage from "@/pages/DutyCalculatorPage";
import NetSalaryCalculatorPage from "./pages/NetSalaryCalculatorPage";
import PublicDebtTrackerPage from "./pages/PublicDebtTrackerPage";
import BonusIseePage from "./pages/BonusIseePage";
import TaxDeadlinesPage from "./pages/TaxDeadlinesPage";
import TaxDeadlineDetailPage from "./pages/TaxDeadlineDetailPage";
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
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/strumenti" component={UtilitiesPage} />
        <Route path="/strumenti/stipendio-netto" component={NetSalaryCalculatorPage} />
        <Route path="/strumenti/debito-pubblico" component={PublicDebtTrackerPage} />
        <Route path="/strumenti/bonus-isee" component={BonusIseePage} />
        <Route path="/strumenti/scadenze-fiscali" component={TaxDeadlinesPage} />
        <Route path="/strumenti/scadenze-fiscali/:id" component={TaxDeadlineDetailPage} />
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
