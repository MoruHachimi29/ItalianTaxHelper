import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { 
  insertFormSchema, 
  insertTutorialSchema, 
  insertNewsSchema,
  insertBlogPostSchema,
  f24OrdinarySchema,
  f24SimplifiedSchema,
  f24ExciseSchema,
  f24ElideSchema,
  f23Schema
} from "@shared/schema";
import { PDFDocument } from "pdf-lib";
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

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  
  // Get all tutorials
  app.get("/api/tutorials", async (req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial" });
    }
  });
  
  // Get tutorials by type
  app.get("/api/tutorials/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const tutorials = await storage.getTutorialsByType(type);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial" });
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
  
  // Get the latest economic news from Italy and the world using NewsAPI
  app.get("/api/economic-news", async (req, res) => {
    try {
      // Get query parameters with defaults
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      
      // Get today's date in ISO format for the API call
      const today = new Date();
      // Get a date two days ago to ensure we have enough articles
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      // Format dates for API
      const todayFormatted = today.toISOString().split('T')[0];
      const twoDaysAgoFormatted = twoDaysAgo.toISOString().split('T')[0];
      
      // Fetch economic news in Italian language
      const response = await fetch(
        `${NEWS_API_URL}/everything?` +
        `q=economia OR finanza OR tasse OR fisco OR tributario&` +
        `language=it&` +
        `sortBy=publishedAt&` +
        `from=${twoDaysAgoFormatted}&` +
        `to=${todayFormatted}&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json() as {
        status: string;
        articles: Array<{
          title: string;
          description: string;
          source: { name: string };
          url: string;
          urlToImage: string | null;
          publishedAt: string;
          author: string | null;
        }>;
        totalResults: number;
        message?: string;
      };
      
      if (data.status === "error") {
        console.error("Error fetching economic news:", data.message);
        return res.status(500).json({ error: data.message });
      }
      
      // Format the response to match our news schema
      const formattedNews = data.articles.map((article: any) => ({
        title: article.title,
        content: article.description,
        source: article.source.name,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        author: article.author
      }));
      
      return res.json({
        articles: formattedNews,
        totalResults: data.totalResults,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(data.totalResults / pageSize)
      });
    } catch (error) {
      console.error("Error in economic-news route:", error);
      return res.status(500).json({ error: "Failed to fetch economic news" });
    }
  });
  
  // Get news by category (economia, fisco, finanza)
  app.get("/api/economic-news/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      
      // Map categories to search queries
      const categoryQueries: {[key: string]: string} = {
        "economia": "economia OR pil OR inflazione",
        "fisco": "fisco OR tasse OR tributario OR imposte",
        "finanza": "finanza OR borsa OR investimenti OR mercati",
        "lavoro": "lavoro OR occupazione OR contratti OR stipendi",
        "tecnologia": "tecnologia OR digitale OR intelligenza artificiale OR ai OR smartphone OR computer"
      };
      
      const query = categoryQueries[category] || category;
      
      // Get today's date in ISO format for the API call
      const today = new Date();
      // Get a date two days ago to ensure we have enough articles
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      // Format dates for API
      const todayFormatted = today.toISOString().split('T')[0];
      const twoDaysAgoFormatted = twoDaysAgo.toISOString().split('T')[0];
      
      const response = await fetch(
        `${NEWS_API_URL}/everything?` +
        `q=${query}&` +
        `language=it&` +
        `sortBy=publishedAt&` +
        `from=${twoDaysAgoFormatted}&` +
        `to=${todayFormatted}&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json() as {
        status: string;
        articles: Array<{
          title: string;
          description: string;
          source: { name: string };
          url: string;
          urlToImage: string | null;
          publishedAt: string;
          author: string | null;
        }>;
        totalResults: number;
        message?: string;
      };
      
      if (data.status === "error") {
        console.error(`Error fetching ${category} news:`, data.message);
        return res.status(500).json({ error: data.message });
      }
      
      // Format the response
      const formattedNews = data.articles.map((article: any) => ({
        title: article.title,
        content: article.description,
        source: article.source.name,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        author: article.author
      }));
      
      return res.json({
        articles: formattedNews,
        totalResults: data.totalResults,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(data.totalResults / pageSize),
        category: category
      });
    } catch (error) {
      console.error("Error in economic-news/category route:", error);
      return res.status(500).json({ error: "Failed to fetch news by category" });
    }
  });
  
  // Search economic news
  app.get("/api/economic-news/search", async (req, res) => {
    try {
      const searchQuery = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      
      if (!searchQuery) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      // Get today's date in ISO format for the API call
      const today = new Date();
      // Get a date two days ago to ensure we have enough articles
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      // Format dates for API
      const todayFormatted = today.toISOString().split('T')[0];
      const twoDaysAgoFormatted = twoDaysAgo.toISOString().split('T')[0];
      
      const response = await fetch(
        `${NEWS_API_URL}/everything?` +
        `q=${searchQuery}&` +
        `language=it&` +
        `sortBy=publishedAt&` +
        `from=${twoDaysAgoFormatted}&` +
        `to=${todayFormatted}&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json() as {
        status: string;
        articles: Array<{
          title: string;
          description: string;
          source: { name: string };
          url: string;
          urlToImage: string | null;
          publishedAt: string;
          author: string | null;
        }>;
        totalResults: number;
        message?: string;
      };
      
      if (data.status === "error") {
        console.error("Error searching news:", data.message);
        return res.status(500).json({ error: data.message });
      }
      
      // Format the response
      const formattedNews = data.articles.map((article: any) => ({
        title: article.title,
        content: article.description,
        source: article.source.name,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        author: article.author
      }));
      
      return res.json({
        articles: formattedNews,
        totalResults: data.totalResults,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(data.totalResults / pageSize),
        searchQuery: searchQuery
      });
    } catch (error) {
      console.error("Error in economic-news/search route:", error);
      return res.status(500).json({ error: "Failed to search news" });
    }
  });
  
  // Save form data
  app.post("/api/forms", async (req, res) => {
    try {
      const formData = insertFormSchema.parse(req.body);
      
      // Validate specific form data based on type
      const { type, data } = formData;
      
      switch (type) {
        case "f24-ordinario":
          f24OrdinarySchema.parse(data);
          break;
        case "f24-semplificato":
          f24SimplifiedSchema.parse(data);
          break;
        case "f24-accise":
          f24ExciseSchema.parse(data);
          break;
        case "f24-elide":
          f24ElideSchema.parse(data);
          break;
        case "f23":
          f23Schema.parse(data);
          break;
        default:
          return res.status(400).json({ message: "Tipo di modulo non valido" });
      }
      
      const savedForm = await storage.createForm(formData);
      res.status(201).json(savedForm);
    } catch (error) {
      res.status(400).json({ message: "Dati del modulo non validi", error });
    }
  });
  
  // Generate PDF from form data
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const { formType, formData } = req.body;
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      
      // Add form data to PDF
      // This is simplified - in a real implementation, you would position text fields
      // according to the form layout and add the form image as a background
      
      const { width, height } = page.getSize();
      
      // Add title
      page.drawText(`Modulo ${formType.toUpperCase()}`, {
        x: 50,
        y: height - 50,
        size: 24
      });
      
      // Add form data
      let yPosition = height - 100;
      Object.entries(formData).forEach(([key, value]) => {
        page.drawText(`${key}: ${value}`, {
          x: 50,
          y: yPosition,
          size: 12
        });
        yPosition -= 20;
      });
      
      // Serialize PDF to bytes
      const pdfBytes = await pdfDoc.save();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${formType}.pdf`);
      
      // Send the PDF as a buffer
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      res.status(500).json({ message: "Errore nella generazione del PDF" });
    }
  });
  
  // Blog API endpoints
  
  // Get all blog posts with pagination
  app.get("/api/blog", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await storage.getAllBlogPosts(page, limit);
      
      res.json({
        posts: result.posts,
        totalCount: result.totalCount,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(result.totalCount / limit)
      });
    } catch (error) {
      console.error("Error in /api/blog route:", error);
      res.status(500).json({ message: "Errore nel recupero degli articoli del blog" });
    }
  });
  
  // Get latest blog posts
  app.get("/api/blog/latest", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const latestPosts = await storage.getLatestBlogPosts(limit);
      res.json(latestPosts);
    } catch (error) {
      console.error("Error in /api/blog/latest route:", error);
      res.status(500).json({ message: "Errore nel recupero degli ultimi articoli del blog" });
    }
  });
  
  // Get blog post by slug
  app.get("/api/blog/post/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Articolo non trovato" });
      }
      
      res.json(post);
    } catch (error) {
      console.error(`Error in /api/blog/post/${req.params.slug} route:`, error);
      res.status(500).json({ message: "Errore nel recupero dell'articolo del blog" });
    }
  });
  
  // Get blog posts by category
  app.get("/api/blog/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.getBlogPostsByCategory(category, page, limit);
      
      res.json({
        posts: result.posts,
        totalCount: result.totalCount,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(result.totalCount / limit),
        category
      });
    } catch (error) {
      console.error(`Error in /api/blog/category/${req.params.category} route:`, error);
      res.status(500).json({ message: "Errore nel recupero degli articoli per categoria" });
    }
  });
  
  // Search blog posts
  app.get("/api/blog/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim() === "") {
        return res.status(400).json({ message: "È necessario specificare un termine di ricerca" });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await storage.searchBlogPosts(query, page, limit);
      
      res.json({
        posts: result.posts,
        totalCount: result.totalCount,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(result.totalCount / limit),
        searchQuery: query
      });
    } catch (error) {
      console.error("Error in /api/blog/search route:", error);
      res.status(500).json({ message: "Errore nella ricerca degli articoli" });
    }
  });
  
  // Get related posts
  app.get("/api/blog/related/:postId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const limit = parseInt(req.query.limit as string) || 3;
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "ID articolo non valido" });
      }
      
      const relatedPosts = await storage.getRelatedBlogPosts(postId, limit);
      res.json(relatedPosts);
    } catch (error) {
      console.error(`Error in /api/blog/related/${req.params.postId} route:`, error);
      res.status(500).json({ message: "Errore nel recupero degli articoli correlati" });
    }
  });
  
  // Create a new blog post
  app.post("/api/blog/post", async (req, res) => {
    try {
      const blogPostData = insertBlogPostSchema.parse(req.body);
      const savedPost = await storage.createBlogPost(blogPostData);
      res.status(201).json(savedPost);
    } catch (error) {
      console.error("Error in POST /api/blog/post route:", error);
      res.status(400).json({ message: "Dati dell'articolo non validi", error });
    }
  });
  
  // Update a blog post
  app.put("/api/blog/post/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID articolo non valido" });
      }
      
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Articolo non trovato" });
      }
      
      const updatedPostData = req.body;
      const updatedPost = await storage.updateBlogPost(id, updatedPostData);
      
      res.json(updatedPost);
    } catch (error) {
      console.error(`Error in PUT /api/blog/post/${req.params.id} route:`, error);
      res.status(400).json({ message: "Errore nell'aggiornamento dell'articolo", error });
    }
  });
  
  // Delete a blog post
  app.delete("/api/blog/post/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID articolo non valido" });
      }
      
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Articolo non trovato" });
      }
      
      await storage.deleteBlogPost(id);
      res.status(204).end();
    } catch (error) {
      console.error(`Error in DELETE /api/blog/post/${req.params.id} route:`, error);
      res.status(500).json({ message: "Errore nell'eliminazione dell'articolo" });
    }
  });

  // API per il debito pubblico
  
  // Ottieni i paesi supportati
  app.get("/api/public-debt/countries", (req, res) => {
    res.json({ countries: supportedCountries });
  });
  
  // Ottieni i dati correnti del debito pubblico per un paese
  app.get("/api/public-debt/current", getCurrentPublicDebt);
  
  app.get("/api/public-debt/historical", getHistoricalPublicDebt);
  
  // Confronta il debito pubblico tra due paesi
  app.get("/api/public-debt/compare", comparePublicDebt);

  // API per i Bonus ISEE 2025
  
  // Ottieni tutte le categorie dei bonus
  app.get("/api/bonus/categories", getBonusCategories);
  
  // Ottieni tutti i bonus con filtri opzionali
  app.get("/api/bonus", getAllBonus);
  
  // Ottieni i range ISEE predefiniti
  app.get("/api/bonus/isee-ranges", getIseeRanges);
  
  // Ottieni i bonus nuovi
  app.get("/api/bonus/new", getNewBonus);
  
  // Ottieni i bonus in scadenza
  app.get("/api/bonus/expiring", getExpiringBonus);
  
  // Ottieni un bonus specifico per ID
  app.get("/api/bonus/:id", getBonusById);

  // API per le Scadenze Fiscali
  
  // Ottieni tutte le scadenze fiscali con filtri opzionali
  app.get("/api/tax-deadlines", getAllTaxDeadlines);
  
  // Ottieni le categorie delle scadenze fiscali
  app.get("/api/tax-deadlines/categories", getTaxDeadlineCategories);
  
  // Ottieni le scadenze del mese corrente
  app.get("/api/tax-deadlines/current-month", getCurrentMonthDeadlines);
  
  // Ottieni le scadenze imminenti
  app.get("/api/tax-deadlines/upcoming", getUpcomingDeadlines);
  
  // Ottieni una scadenza specifica per ID
  app.get("/api/tax-deadlines/:id", getTaxDeadlineById);

  const httpServer = createServer(app);
  return httpServer;
}
