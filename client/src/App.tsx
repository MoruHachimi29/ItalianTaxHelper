import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Importazione immediata solo per le pagine critiche del percorso principale
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Pagina di caricamento per Suspense
import { Skeleton } from "@/components/ui/skeleton";

// Code splitting con lazy loading per tutte le altre pagine
// Questo riduce significativamente la dimensione iniziale del bundle
const FormPage = lazy(() => import("@/pages/FormPage"));
const ModulesPage = lazy(() => import("@/pages/ModulesPage"));
const TutorialsPage = lazy(() => import("@/pages/TutorialsPage"));
const VideoTutorialPage = lazy(() => import("@/pages/VideoTutorialPage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const UtilitiesPage = lazy(() => import("@/pages/UtilitiesPage"));
const CurrencyConverterPage = lazy(() => import("@/pages/CurrencyConverterPage"));
const DutyCalculatorPage = lazy(() => import("@/pages/DutyCalculatorPage"));
const NetSalaryCalculatorPage = lazy(() => import("./pages/NetSalaryCalculatorPage"));
const PublicDebtTrackerPage = lazy(() => import("./pages/PublicDebtTrackerPage"));
const BonusIseePage = lazy(() => import("./pages/BonusIseePage"));
const TaxDeadlinesPage = lazy(() => import("./pages/TaxDeadlinesPage"));
const TaxDeadlineDetailPage = lazy(() => import("./pages/TaxDeadlineDetailPage"));
const P7mConverterPage = lazy(() => import("@/pages/P7mConverterPage"));
const XmlToPngConverterPage = lazy(() => import("@/pages/XmlToPngConverterPage"));
const PdfEditorPage = lazy(() => import("@/pages/PdfEditorPage"));
const PdfToWordConverterPage = lazy(() => import("@/pages/PdfToWordConverterPage"));
const AdvancedPdfEditorPage = lazy(() => import("@/pages/AdvancedPdfEditorPage"));
const SimplePdfEditorPage = lazy(() => import("@/pages/SimplePdfEditorPage"));
const BasicPdfEditorPage = lazy(() => import("@/pages/BasicPdfEditorPage"));
const CodiceFiscalePage = lazy(() => import("@/pages/CodiceFiscalePage"));

// Pagine del forum
const ForumPage = lazy(() => import("@/pages/ForumPage"));
const ForumTopicPage = lazy(() => import("@/pages/ForumTopicPage"));
const NewForumTopicPage = lazy(() => import("@/pages/NewForumTopicPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));

// Componente che fa scrollare all'inizio della pagina ad ogni cambio di route
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

// Componente di fallback per Suspense
function PageLoader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-1/2 rounded" />
          <Skeleton className="h-10 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      {/* Aggiungiamo il componente per scrollare all'inizio della pagina */}
      <ScrollToTop />
      
      {/* Suspense per il lazy loading */}
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/moduli" component={ModulesPage} />
          <Route path="/moduli/:formType" component={FormPage} />
          <Route path="/tutorial" component={TutorialsPage} />
          <Route path="/video-tutorial/:slug" component={VideoTutorialPage} />
          <Route path="/notizie" component={NewsPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogPostPage} />
          <Route path="/strumenti" component={UtilitiesPage} />
          <Route path="/strumenti/stipendio-netto" component={NetSalaryCalculatorPage} />
          <Route path="/strumenti/debito-pubblico" component={PublicDebtTrackerPage} />
          <Route path="/strumenti/bonus-isee" component={BonusIseePage} />
          <Route path="/strumenti/scadenze-fiscali" component={TaxDeadlinesPage} />
          <Route path="/strumenti/scadenze-fiscali/:id" component={TaxDeadlineDetailPage} />
          <Route path="/strumenti/codice-fiscale" component={CodiceFiscalePage} />
          <Route path="/strumenti/valuta" component={CurrencyConverterPage} />
          <Route path="/strumenti/dazi" component={DutyCalculatorPage} />
          <Route path="/strumenti/p7m" component={P7mConverterPage} />
          <Route path="/strumenti/xml-png" component={XmlToPngConverterPage} />
          <Route path="/strumenti/pdf-editor" component={PdfEditorPage} />
          <Route path="/strumenti/pdf-editor-avanzato" component={AdvancedPdfEditorPage} />
          <Route path="/strumenti/pdf-editor-semplice" component={SimplePdfEditorPage} />
          <Route path="/strumenti/pdf-editor-base" component={BasicPdfEditorPage} />
          <Route path="/strumenti/pdf-word" component={PdfToWordConverterPage} />
          <Route path="/contatti" component={ContactPage} />
          
          {/* Rotte per il forum */}
          <Route path="/forum" component={ForumPage} />
          <Route path="/forum/topic/:slug" component={ForumTopicPage} />
          <ProtectedRoute path="/forum/nuovo-topic" component={NewForumTopicPage} />
          
          {/* Autenticazione */}
          <Route path="/auth" component={AuthPage} />
          
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
