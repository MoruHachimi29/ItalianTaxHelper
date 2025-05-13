import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import multer from "multer";
import { storage } from "./mock-storage";
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import {
  insertFormSchema,
  insertTutorialSchema,
  insertNewsSchema,
  insertBlogPostSchema,
  insertForumCategorySchema,
  insertForumTopicSchema,
  insertForumPostSchema,
  insertForumReactionSchema,
  f24OrdinarySchema,
  f24SimplifiedSchema,
  f24ExciseSchema,
  f24ElideSchema,
  f23Schema
} from "@shared/schema";
import { PDFDocument } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Header, Footer, PageBreak } from 'docx';
import pdfParse from 'pdf-parse';
import { getCurrentPublicDebt, getHistoricalPublicDebt, comparePublicDebt, supportedCountries } from "./controllers/publicDebtController";
import { 
  getBonusCategories,
  getAllBonus,
  getIseeRanges,
  getNewBonus,
  getExpiringBonus,
  getBonusById
} from "./controllers/bonusController";
import {
  getAllTaxDeadlines,
  getTaxDeadlineCategories,
  getCurrentMonthDeadlines,
  getUpcomingDeadlines,
  getTaxDeadlineById
} from "./controllers/taxDeadlinesController";
// Le importazioni del forum sono state rimosse

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // API utente semplificata senza autenticazione
  app.get("/api/user", (req, res) => {
    // Restituisce sempre una risposta non autenticata
    res.status(401).json({ message: "Non autenticato" });
  });
  
  // Risposta semplificata per l'autenticazione Google
  app.post("/api/auth/google", (req, res) => {
    res.status(401).json({ message: "Funzionalità di login disabilitata" });
  });
  
  // Risposta semplificata per il login
  app.post("/api/login", (req, res) => {
    res.status(401).json({ message: "Funzionalità di login disabilitata" });
  });
  
  // Risposta semplificata per la registrazione
  app.post("/api/register", (req, res) => {
    res.status(401).json({ message: "Funzionalità di registrazione disabilitata" });
  });
  
  // Risposta semplificata per il logout
  app.post("/api/logout", (req, res) => {
    res.status(200).json({ message: "Logout effettuato con successo" });
  });

  
  // Tutorial routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial" });
    }
  });
  
  // Get tutorials by type
  app.get("/api/tutorials/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const tutorials = await storage.getTutorialsByType(type);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial" });
    }
  });
  
  // Get video tutorials
  app.get("/api/tutorials/video", async (req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      const videoTutorials = tutorials.filter(tutorial => tutorial.isVideo === true);
      res.json(videoTutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial video" });
    }
  });
  
  // Get tutorial by ID
  app.get("/api/tutorials/id/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID tutorial non valido" });
      }
      
      const tutorial = await storage.getTutorial(id);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial non trovato" });
      }
      
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero del tutorial" });
    }
  });
  
  // Update tutorial
  app.put("/api/tutorials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID tutorial non valido" });
      }
      
      // Verifica che il tutorial esista
      const existingTutorial = await storage.getTutorial(id);
      if (!existingTutorial) {
        return res.status(404).json({ message: "Tutorial non trovato" });
      }
      
      // Prepara i dati per l'aggiornamento
      const updatedData = {
        ...req.body,
        id: undefined // Assicuriamoci che non si possa cambiare l'ID
      };
      
      // Aggiorna il tutorial
      const tutorial = await storage.updateTutorial(id, updatedData);
      if (!tutorial) {
        return res.status(500).json({ message: "Errore nell'aggiornamento del tutorial" });
      }
      
      res.json(tutorial);
    } catch (error) {
      console.error("Error updating tutorial:", error);
      res.status(500).json({ message: "Errore nell'aggiornamento del tutorial" });
    }
  });
  
  // Get latest news
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const latestNews = await storage.getLatestNews(limit);
      res.json(latestNews);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero delle notizie" });
    }
  });
  
  // Get all news
  app.get("/api/news/all", async (req, res) => {
    try {
      const allNews = await storage.getAllNews();
      res.json(allNews);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero delle notizie" });
    }
  });
  
  // Get single news item
  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const newsItem = await storage.getNews(parseInt(id));
      
      if (!newsItem) {
        return res.status(404).json({ message: "Notizia non trovata" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero della notizia" });
    }
  });
  
  // Economic News API endpoints
  app.get("/api/economic-news", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      
      // Recuperiamo le notizie dal database
      const allNews = await storage.getAllNews();
      
      // Se non c'è una chiave API o la pagina richiesta è 1 (prima pagina), usiamo le notizie locali
      if (!NEWS_API_KEY || page === 1) {
        console.log("Usando notizie dal database per /api/economic-news");
        
        // Adattiamo il formato delle notizie dal database al formato atteso dal frontend
        const adaptedNews = allNews.map(news => ({
          title: news.title,
          content: news.content,
          description: news.content,
          publishedAt: news.publishDate,
          author: news.author,
          url: `#news-${news.id}`,
          source: {
            id: String(news.id),
            name: "F24Editabile"
          },
          urlToImage: null
        }));
        
        const totalCount = adaptedNews.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedNews = adaptedNews.slice(startIndex, endIndex);
        
        return res.json({
          articles: paginatedNews,
          totalResults: totalCount,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      }
      
      // Per le pagine successive proviamo prima con la News API
      try {
        // Utilizziamo News API per ottenere notizie economiche reali
        const newsApiUrl = `${NEWS_API_URL}/top-headlines?country=it&category=business&apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`;
        
        const response = await fetch(newsApiUrl);
        const data = await response.json() as {
          status: string;
          totalResults: number;
          articles: Array<any>;
          message?: string;
        };
        
        if (!response.ok) {
          console.error("News API error:", data);
          throw new Error(data.message || "Errore nel recupero delle notizie economiche");
        }
        
        // Se non ci sono risultati dall'API, usiamo quelle dal database
        if (data.totalResults === 0 || data.articles.length === 0) {
          throw new Error("Nessun risultato dalla News API");
        }
        
        const totalPages = Math.ceil(data.totalResults / pageSize) || 1;
        
        // Aggiungiamo i campi mancanti alla risposta
        const enrichedData = {
          ...data,
          currentPage: page,
          pageSize,
          totalPages
        };
        
        return res.json(enrichedData);
      } catch (apiError: unknown) {
        console.log("Fallback al database: ", apiError instanceof Error ? apiError.message : String(apiError));
        
        // Se c'è un errore con la News API, usiamo le notizie dal database come fallback
        const adaptedNews = allNews.map(news => ({
          title: news.title,
          content: news.content,
          description: news.content,
          publishedAt: news.publishDate,
          author: news.author,
          url: `#news-${news.id}`,
          source: {
            id: String(news.id),
            name: "F24Editabile"
          },
          urlToImage: null
        }));
        
        const totalCount = adaptedNews.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedNews = adaptedNews.slice(startIndex, endIndex);
        
        return res.json({
          articles: paginatedNews,
          totalResults: totalCount,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      }
    } catch (error) {
      console.error("Error fetching economic news:", error);
      res.status(500).json({ message: "Errore nel recupero delle notizie economiche" });
    }
  });
  
  app.get("/api/economic-news/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      
      if (!query) {
        return res.status(400).json({ message: "Parametro di ricerca mancante" });
      }
      
      // Se non c'è una chiave API, cerchiamo nelle notizie del database
      if (!NEWS_API_KEY) {
        const allNews = await storage.getAllNews();
        const filteredNews = allNews.filter(news => 
          news.title.toLowerCase().includes(query.toLowerCase()) || 
          (news.content && news.content.toLowerCase().includes(query.toLowerCase()))
        );
        
        const totalCount = filteredNews.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedNews = filteredNews.slice(startIndex, endIndex);
        
        return res.json({
          articles: paginatedNews,
          totalResults: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      }
      
      // Utilizziamo News API per cercare notizie
      const newsApiUrl = `${NEWS_API_URL}/everything?q=${encodeURIComponent(query)}&language=it&apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`;
      
      const response = await fetch(newsApiUrl);
      const data = await response.json() as {
        status: string;
        totalResults: number;
        articles: Array<any>;
        message?: string;
      };
      
      if (!response.ok) {
        console.error("News API search error:", data);
        throw new Error(data.message || "Errore nella ricerca delle notizie");
      }
      
      const totalPages = Math.ceil(data.totalResults / pageSize) || 1;
      
      // Aggiungiamo i campi mancanti alla risposta
      const enrichedData = {
        ...data,
        currentPage: page,
        pageSize,
        totalPages
      };
      
      res.json(enrichedData);
    } catch (error) {
      console.error("Error searching economic news:", error);
      res.status(500).json({ message: "Errore nella ricerca delle notizie" });
    }
  });
  
  app.get("/api/economic-news/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      
      // Se non c'è una chiave API, restituiamo notizie dal database
      if (!NEWS_API_KEY) {
        const allNews = await storage.getAllNews();
        // Simuliamo il filtraggio per categoria cercando nel titolo e nel contenuto
        const filteredNews = allNews.filter(news => 
          news.title.toLowerCase().includes(category.toLowerCase()) ||
          (news.content && news.content.toLowerCase().includes(category.toLowerCase()))
        );
        
        const totalCount = filteredNews.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedNews = filteredNews.slice(startIndex, endIndex);
        
        return res.json({
          articles: paginatedNews,
          totalResults: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      }
      
      // Utilizziamo News API per ottenere notizie per categoria
      // News API supporta solo alcune categorie specifiche, quindi facciamo una ricerca
      // basata sulla categoria come parola chiave se non è una categoria standard
      const standardCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];
      let newsApiUrl;
      
      if (standardCategories.includes(category)) {
        newsApiUrl = `${NEWS_API_URL}/top-headlines?country=it&category=${category}&apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`;
      } else {
        newsApiUrl = `${NEWS_API_URL}/everything?q=${encodeURIComponent(category)}&language=it&apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${pageSize}`;
      }
      
      const response = await fetch(newsApiUrl);
      const data = await response.json() as {
        status: string;
        totalResults: number;
        articles: Array<any>;
        message?: string;
      };
      
      if (!response.ok) {
        console.error("News API category error:", data);
        throw new Error(data.message || "Errore nel recupero delle notizie per categoria");
      }
      
      const totalPages = Math.ceil(data.totalResults / pageSize) || 1;
      
      // Aggiungiamo i campi mancanti alla risposta
      const enrichedData = {
        ...data,
        currentPage: page,
        pageSize,
        totalPages
      };
      
      res.json(enrichedData);
    } catch (error) {
      console.error("Error fetching economic news by category:", error);
      res.status(500).json({ message: "Errore nel recupero delle notizie per categoria" });
    }
  });
  
  // Blog API endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const { posts, totalCount } = await storage.getAllBlogPosts(page, limit);
      res.json({ posts, totalCount, currentPage: page, totalPages: Math.ceil(totalCount / limit) });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Errore nel recupero dei post del blog" });
    }
  });
  
  app.get("/api/blog/latest", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const latestPosts = await storage.getLatestBlogPosts(limit);
      res.json(latestPosts);
    } catch (error) {
      console.error("Error fetching latest blog posts:", error);
      res.status(500).json({ message: "Errore nel recupero dei post recenti del blog" });
    }
  });
  
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Errore nel recupero del post" });
    }
  });
  
  // Bonus ISEE API endpoints
  app.get("/api/bonus", getAllBonus);
  app.get("/api/bonus/categories", getBonusCategories);
  app.get("/api/bonus/isee-ranges", getIseeRanges);
  app.get("/api/bonus/new", getNewBonus);
  app.get("/api/bonus/expiring", getExpiringBonus);
  app.get("/api/bonus/:id", getBonusById);

  // Scadenze Fiscali API endpoints
  app.get("/api/tax-deadlines", getAllTaxDeadlines);
  app.get("/api/tax-deadlines/categories", getTaxDeadlineCategories);
  app.get("/api/tax-deadlines/current-month", getCurrentMonthDeadlines);
  app.get("/api/tax-deadlines/upcoming", getUpcomingDeadlines);
  app.get("/api/tax-deadlines/:id", getTaxDeadlineById);

  // Debito Pubblico API endpoints
  app.get("/api/public-debt/countries", async (req, res) => {
    try {
      const countries = supportedCountries;
      res.json({ countries });
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ error: "Errore nel recupero dei paesi" });
    }
  });
  
  app.get("/api/public-debt/current", async (req, res) => {
    try {
      const { country } = req.query;
      
      if (!country) {
        return res.status(400).json({ error: "Parametro paese mancante" });
      }
      
      // Passiamo direttamente req e res
      await getCurrentPublicDebt(req, res);
    } catch (error) {
      console.error("Error fetching current public debt:", error);
      res.status(500).json({ error: "Errore nel recupero del debito pubblico corrente" });
    }
  });
  
  app.get("/api/public-debt/historical", async (req, res) => {
    try {
      const { country, years } = req.query;
      
      if (!country) {
        return res.status(400).json({ error: "Parametro paese mancante" });
      }
      
      // Passiamo direttamente req e res
      await getHistoricalPublicDebt(req, res);
    } catch (error) {
      console.error("Error fetching historical public debt:", error);
      res.status(500).json({ error: "Errore nel recupero dei dati storici del debito pubblico" });
    }
  });
  
  app.get("/api/public-debt/compare", async (req, res) => {
    try {
      const { country1, country2 } = req.query;
      
      if (!country1 || !country2) {
        return res.status(400).json({ error: "Parametri paesi mancanti" });
      }
      
      // Passiamo req e res
      await comparePublicDebt(req, res);
    } catch (error) {
      console.error("Error comparing public debt:", error);
      const errorMsg = error instanceof Error ? error.message : "Errore nel confronto dei dati del debito pubblico";
      res.status(500).json({ error: errorMsg });
    }
  });

  // Le API del forum sono state rimosse
  // Configurazione di multer per gestire i file caricati
  const upload = multer({ storage: multer.memoryStorage() });

  // PDF to Word conversion endpoint - Implementazione professionale avanzata con diverse opzioni
  app.post('/api/convert-pdf', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      // Verifica che il file sia un PDF valido
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Il file deve essere in formato PDF' });
      }

      // Estrai titolo dal nome del file o usa un titolo predefinito
      const fileName = req.file.originalname || 'documento';
      const title = fileName.replace(/\.pdf$/i, '');
      
      // Determina il formato di output (docx o rtf)
      const outputFormat = req.body.format || 'docx';
      
      // Ottiene il buffer del PDF
      const pdfBuffer = req.file.buffer;
      
      // Utilizza la libreria pdflib per estrarre informazioni
      let numPages = 1;
      try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        numPages = pdfDoc.getPageCount();
        console.log(`Il PDF contiene ${numPages} pagine`);
      } catch (pdfError) {
        console.warn('Avviso: Impossibile analizzare la struttura del PDF:', pdfError);
      }
      
      // Crea un documento Word (DOCX) usando docx
      if (outputFormat === 'docx') {
        // Preparazione dei paragrafi per il documento Word
        const allParagraphs: Paragraph[] = [];
        
        // Aggiungi intestazione del documento con il titolo
        const headerParagraph = new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 400,
            after: 400
          },
          thematicBreak: true
        });
        
        allParagraphs.push(headerParagraph);
        
        // Aggiungiamo una sezione con i metadati del file originale
        allParagraphs.push(
          new Paragraph({
            text: "Informazioni sul documento",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 300,
              after: 120
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `File originale: ${req.file.originalname}`,
            spacing: {
              before: 120,
              after: 60
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `Dimensione: ${(req.file.size / 1024).toFixed(2)} KB`,
            spacing: {
              before: 60,
              after: 60
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `Numero di pagine: ${numPages}`,
            spacing: {
              before: 60,
              after: 60
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `Convertito il: ${new Date().toLocaleString('it-IT')}`,
            spacing: {
              before: 60,
              after: 300
            }
          })
        );
        
        // Nota sul documento
        allParagraphs.push(
          new Paragraph({
            text: "Nota sulla conversione",
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 200,
              after: 120
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: "Questo documento è stato convertito da PDF a Word mantenendo la struttura generale. Potrebbero esserci alcune differenze nella formattazione rispetto al documento originale.",
            spacing: {
              before: 120,
              after: 120
            }
          })
        );
        
        // Aggiungi spazio per il contenuto
        allParagraphs.push(
          new Paragraph({
            text: "Contenuto del documento",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200
            }
          })
        );
        
        // Estrai il contenuto del PDF usando pdf-parse con approccio diretto
        // Usiamo l'approccio più semplice ma più affidabile per estrarre il testo
        let pdfContent = "";
        try {
          // Uso diretto senza opzioni personalizzate per massimizzare la compatibilità
          const pdfData = await pdfParse(pdfBuffer);
          
          pdfContent = pdfData.text || "";
          console.log(`Estratto ${pdfContent.length} caratteri dal PDF`);
          
          // Aggiungiamo dettagli dal PDF per arricchire l'output
          if (pdfData.info) {
            console.log('Informazioni PDF:', JSON.stringify(pdfData.info));
          }
          if (pdfData.metadata) {
            console.log('Metadata PDF:', JSON.stringify(pdfData.metadata));
          }
        } catch (parseError) {
          console.error('Errore nell\'estrazione del testo dal PDF:', parseError);
          pdfContent = "Non è stato possibile estrarre il testo dal PDF.";
        }
        
        // Approccio semplificato che mantiene il testo originale
        // Eliminiamo l'elaborazione sofisticata che potrebbe alterare il contenuto originale
        
        // Normalizza solo le interruzioni di riga per coerenza
        let processedContent = pdfContent
          .replace(/\r\n/g, '\n')  // Normalizza interruzioni di riga
          .trim();
        
        // Dividi in righe ma mantieni il contenuto originale
        const contentLines = processedContent.split('\n')
          .filter(line => line.length > 0);  // Rimuovi solo le righe vuote
        
        // Crea paragrafi semplici per ogni riga, senza perdere contenuto
        const simpleParagraphs = contentLines.map(line => ({
          text: line,
          type: 'paragraph'
        }));

        // Mettiamo tutto il contenuto in una singola "pagina" per evitare perdite
        const pageContent = [simpleParagraphs];
        
        if (pageContent.length > 0) {
          // Per ogni pagina di contenuto
          for (let i = 0; i < pageContent.length; i++) {
            const pageParagraphs = pageContent[i];
            
            // Intestazione di pagina
            allParagraphs.push(
              new Paragraph({
                text: `Pagina ${i + 1}`,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                  before: 300,
                  after: 120
                }
              })
            );
            
            // Aggiungi ogni paragrafo formattato correttamente
            for (const paragraph of pageParagraphs) {
              // Nel nostro approccio semplificato, tutti i paragrafi sono di tipo 'paragraph'
              // Non ci saranno paragrafi di tipo 'heading' quindi possiamo omettere questo blocco
              // ma lo manteniamo per retrocompatibilità e chiarezza
              if (false && paragraph.type === 'heading') {
                // Omesso - non ci saranno più elementi di tipo 'heading'
                // poiché abbiamo semplificato l'approccio
              } else {
                // È un paragrafo normale
                // Verifica se è un elenco puntato o numerato
                const text = paragraph.text;
                const isBulletList = text.match(/^[\s]*[•\-\*]\s/);
                const isNumberedList = text.match(/^[\s]*\d+[.)]\s/);
                
                if (isBulletList) {
                  // Formatta come elenco puntato
                  allParagraphs.push(
                    new Paragraph({
                      text: text.replace(/^[\s]*[•\-\*]\s/, ''),
                      bullet: {
                        level: 0
                      },
                      spacing: {
                        before: 60,
                        after: 60
                      }
                    })
                  );
                } else if (isNumberedList) {
                  // Formatta come elenco numerato
                  const num = text.match(/^[\s]*(\d+)[.)]\s/)?.[1] || "1";
                  allParagraphs.push(
                    new Paragraph({
                      text: text.replace(/^[\s]*\d+[.)]\s/, ''),
                      numbering: {
                        reference: "default",
                        level: 0,
                        instance: parseInt(num) || 1
                      },
                      spacing: {
                        before: 60,
                        after: 60
                      }
                    })
                  );
                } else {
                  // Paragrafo normale
                  allParagraphs.push(
                    new Paragraph({
                      text: text,
                      spacing: {
                        before: 80,
                        after: 80
                      }
                    })
                  );
                }
              }
            }
            
            // Aggiungi un'interruzione di pagina tra le pagine (tranne l'ultima)
            if (i < pageContent.length - 1) {
              allParagraphs.push(
                new Paragraph({
                  children: [
                    new PageBreak()
                  ]
                })
              );
            }
          }
        } else {
          // Fallback in caso di errore nell'estrazione del testo
          for (let i = 0; i < numPages; i++) {
            allParagraphs.push(
              new Paragraph({
                text: `Contenuto pagina ${i + 1}`,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                  before: 300,
                  after: 120
                }
              })
            );
            
            allParagraphs.push(
              new Paragraph({
                text: "Il contenuto di questa pagina non è stato estratto correttamente. Il PDF potrebbe essere protetto o contenere elementi non convertibili in testo.",
                spacing: {
                  before: 120,
                  after: 120
                }
              })
            );
            
            // Aggiungi un'interruzione di pagina (tranne per l'ultima pagina)
            if (i < numPages - 1) {
              allParagraphs.push(
                new Paragraph({
                  children: [
                    new PageBreak()
                  ]
                })
              );
            }
          }
        }
        
        // Crea il documento Word professionale
        const doc = new Document({
          creator: "F24Editabile",
          title: title,
          description: "Documento convertito da PDF a Word",
          styles: {
            paragraphStyles: [
              {
                id: "Heading1",
                name: "Heading 1",
                quickFormat: true,
                run: {
                  size: 36, // 18pt
                  bold: true,
                  color: "000000"
                },
                paragraph: {
                  spacing: {
                    before: 400,
                    after: 200
                  }
                }
              },
              {
                id: "Heading2",
                name: "Heading 2",
                quickFormat: true,
                run: {
                  size: 32, // 16pt
                  bold: true,
                  color: "222222"
                },
                paragraph: {
                  spacing: {
                    before: 300,
                    after: 120
                  }
                }
              },
              {
                id: "Heading3",
                name: "Heading 3",
                quickFormat: true,
                run: {
                  size: 28, // 14pt
                  bold: true,
                  color: "444444"
                },
                paragraph: {
                  spacing: {
                    before: 200,
                    after: 80
                  }
                }
              }
            ]
          },
          sections: [
            {
              properties: {
                page: {
                  margin: {
                    top: 700,
                    right: 700,
                    bottom: 700,
                    left: 700
                  }
                }
              },
              headers: {
                default: new Header({
                  children: [
                    new Paragraph({
                      text: "Documento convertito da F24Editabile",
                      alignment: AlignmentType.RIGHT,
                      spacing: {
                        after: 200
                      }
                    })
                  ]
                })
              },
              footers: {
                default: new Footer({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Pagina "
                        })
                      ]
                    })
                  ]
                })
              },
              children: allParagraphs
            }
          ]
        });
  
        // Genera il buffer del documento Word
        const buffer = await Packer.toBuffer(doc);
  
        // Imposta intestazioni corrette e invia il documento
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.docx`);
        res.send(buffer);
      }
      // Crea un documento RTF usando officegen
      else if (outputFormat === 'rtf') {
        const officegen = require('officegen');
        const rtf = officegen('rtf');
        
        // Imposta metadata
        rtf.on('finalize', function(written: number) {
          console.log(`Documento RTF generato con successo. Byte scritti: ${written}`);
        });
        
        rtf.on('error', function(err: Error) {
          console.error('Errore durante la generazione del documento RTF:', err);
        });
        
        // Crea il documento RTF
        // Aggiungi titolo in grassetto
        const pObj = rtf.createP();
        pObj.addText(title, { bold: true, font_size: 24 });
        
        // Aggiungi informazioni sul documento
        rtf.createP().addLineBreak();
        const infoP = rtf.createP();
        infoP.addText('Informazioni sul documento', { bold: true, font_size: 16 });
        
        rtf.createP().addLineBreak();
        rtf.createP().addText(`File originale: ${req.file.originalname}`);
        rtf.createP().addText(`Dimensione: ${(req.file.size / 1024).toFixed(2)} KB`);
        rtf.createP().addText(`Numero di pagine: ${numPages}`);
        rtf.createP().addText(`Convertito il: ${new Date().toLocaleString('it-IT')}`);
        
        rtf.createP().addLineBreak();
        const noteP = rtf.createP();
        noteP.addText('Nota sulla conversione', { bold: true, font_size: 14 });
        
        const noteText = rtf.createP();
        noteText.addText('Questo documento è stato convertito da PDF a RTF. Il formato RTF è più semplice ma compatibile con quasi tutti i programmi di elaborazione testi.');
        
        rtf.createP().addLineBreak();
        const contentP = rtf.createP();
        contentP.addText('Contenuto del documento', { bold: true, font_size: 16 });
        
        // Estrai il contenuto del PDF usando pdf-parse con approccio diretto
        // Usiamo l'approccio più semplice ma più affidabile per estrarre il testo
        let pdfContent = "";
        try {
          // Uso diretto senza opzioni personalizzate per massimizzare la compatibilità
          const pdfData = await pdfParse(pdfBuffer);
          
          pdfContent = pdfData.text || "";
          console.log(`Estratto ${pdfContent.length} caratteri dal PDF per RTF`);
          
          // Aggiungiamo dettagli dal PDF per arricchire l'output
          if (pdfData.info) {
            console.log('Informazioni PDF per RTF:', JSON.stringify(pdfData.info));
          }
          if (pdfData.metadata) {
            console.log('Metadata PDF per RTF:', JSON.stringify(pdfData.metadata));
          }
        } catch (parseError) {
          console.error('Errore nell\'estrazione del testo dal PDF per RTF:', parseError);
          pdfContent = "Non è stato possibile estrarre il testo dal PDF.";
        }
        
        // Approccio semplificato che mantiene il testo originale
        // Eliminiamo l'elaborazione sofisticata che potrebbe alterare il contenuto originale
        
        // Normalizza solo le interruzioni di riga per coerenza
        let processedContent = pdfContent
          .replace(/\r\n/g, '\n')  // Normalizza interruzioni di riga
          .trim();
        
        // Dividi in righe ma mantieni il contenuto originale
        const contentLines = processedContent.split('\n')
          .filter(line => line.length > 0);  // Rimuovi solo le righe vuote
        
        // Crea paragrafi semplici per ogni riga, senza perdere contenuto
        const simpleParagraphs = contentLines.map(line => ({
          text: line,
          type: 'paragraph'
        }));

        // Mettiamo tutto il contenuto in una singola "pagina" per evitare perdite
        const pageContent = [simpleParagraphs];
        
        if (pageContent.length > 0) {
          // Per ogni pagina di contenuto
          for (let i = 0; i < pageContent.length; i++) {
            const pageParagraphs = pageContent[i];
            
            // Intestazione della pagina
            rtf.createP().addLineBreak();
            const pageTitle = rtf.createP();
            pageTitle.addText(`Pagina ${i + 1}`, { bold: true, font_size: 14 });
            
            // Aggiungi ogni paragrafo formattato correttamente
            for (const paragraph of pageParagraphs) {
              // Nel nostro approccio semplificato, tutti i paragrafi sono di tipo 'paragraph'
              // Non ci saranno più tipi speciali come 'heading', 'bullet', o 'numbered'
              
              // Verifica se è un elenco puntato
              const isBulletList = paragraph.text.match(/^[\s]*[•\-\*]\s/);
              if (isBulletList) {
                // Se sembra un elenco puntato, formattalo come tale
                const listP = rtf.createP();
                const content = paragraph.text.replace(/^[\s]*[•\-\*]\s/, '');
                listP.addText("• " + content);
              }
              // Verifica se è un elenco numerato
              else if (paragraph.text.match(/^[\s]*\d+[.)]\s/)) {
                const listP = rtf.createP();
                // Estrai il numero se presente
                const match = paragraph.text.match(/^[\s]*(\d+)[.)]\s/);
                const num = match ? match[1] : "1";
                const content = paragraph.text.replace(/^[\s]*\d+[.)]\s/, '');
                listP.addText(`${num}. ${content}`);
              } 
              // Paragrafo normale
              else {
                const p = rtf.createP();
                p.addText(paragraph.text);
              }
            }
            
            // Aggiungi un'interruzione di pagina (tranne per l'ultima pagina)
            if (i < pageContent.length - 1) {
              rtf.createP().addPageBreak();
            }
          }
        } else {
          // Fallback in caso di errore nell'estrazione del testo
          for (let i = 0; i < numPages; i++) {
            rtf.createP().addLineBreak();
            const pageTitle = rtf.createP();
            pageTitle.addText(`Contenuto pagina ${i + 1}`, { bold: true, font_size: 14 });
            
            const errorP = rtf.createP();
            errorP.addText("Il contenuto di questa pagina non è stato estratto correttamente. Il PDF potrebbe essere protetto o contenere elementi non convertibili in testo.");
            
            // Aggiungi interruzione di pagina (tranne per l'ultima pagina)
            if (i < numPages - 1) {
              rtf.createP().addPageBreak();
            }
          }
        }
        
        // Invia il file RTF
        res.setHeader('Content-Type', 'application/rtf');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.rtf`);
        rtf.generate(res);
      } else {
        return res.status(400).json({ error: 'Formato di output non supportato. Utilizzare "docx" o "rtf".' });
      }
    } catch (error: any) {
      console.error('Errore conversione:', error);
      res.status(500).json({ 
        error: 'Errore durante la conversione. Assicurati che il file sia un PDF valido.',
        details: error.message || 'Errore sconosciuto'
      });
    }
  });

  // Altre route...

  const httpServer = createServer(app);

  return httpServer;
}