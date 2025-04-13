import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
