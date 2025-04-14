import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { 
  insertFormSchema, 
  insertTutorialSchema, 
  insertNewsSchema,
  f24OrdinarySchema,
  f24SimplifiedSchema,
  f24ExciseSchema,
  f24ElideSchema,
  f23Schema
} from "@shared/schema";
import { PDFDocument } from "pdf-lib";

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
      
      // Fetch economic news in Italian language
      const response = await fetch(
        `${NEWS_API_URL}/everything?` +
        `q=economia OR finanza OR tasse OR fisco OR tributario&` +
        `language=it&` +
        `sortBy=publishedAt&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json();
      
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
        "lavoro": "lavoro OR occupazione OR contratti OR stipendi"
      };
      
      const query = categoryQueries[category] || category;
      
      const response = await fetch(
        `${NEWS_API_URL}/everything?` +
        `q=${query}&` +
        `language=it&` +
        `sortBy=publishedAt&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json();
      
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
      
      const response = await fetch(
        `${NEWS_API_URL}/everything?` +
        `q=${searchQuery}&` +
        `language=it&` +
        `sortBy=publishedAt&` +
        `page=${page}&` +
        `pageSize=${pageSize}&` +
        `apiKey=${NEWS_API_KEY}`
      );
      
      const data = await response.json();
      
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

  const httpServer = createServer(app);
  return httpServer;
}
