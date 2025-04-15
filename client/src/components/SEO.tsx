import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  schemaType?: "WebPage" | "Article" | "Organization" | "Product" | "FAQPage";
  schemaData?: Record<string, any>;
}

const defaultDescription = "F24Editabile: compila online moduli F24 ordinario, semplificato, accise, elide e F23. Servizio gratuito per calcolare, scaricare e stampare moduli fiscali italiani.";
const defaultKeywords = "F24 online, F24 editabile, compilare F24 online, modulo F24, F24 semplificato, F24 elide, F24 accise, F23, modulistica fiscale, moduli fiscali online, agenzia entrate, moduli fiscali compilabili";
const siteUrl = "https://f24editabile.replit.app";

export default function SEO({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  canonicalPath = "",
  ogType = "website",
  ogImage = "/og-image.jpg",
  schemaType = "WebPage",
  schemaData = {},
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | F24Editabile`
    : "F24Editabile - Moduli Fiscali Italiani Compilabili Online";
  
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  
  // Base schema
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
  };
  
  // Merge schema data
  const schema = { ...baseSchema, ...schemaData };
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="F24Editabile" />
      <meta property="og:locale" content="it_IT" />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}