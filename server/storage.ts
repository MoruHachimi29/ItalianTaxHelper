import { users, type User, type InsertUser, forms, type Form, type InsertForm, tutorials, type Tutorial, type InsertTutorial, news, type News, type InsertNews } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

// Expanded interface with CRUD methods for all entities
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Form methods
  getForm(id: number): Promise<Form | undefined>;
  getFormsByUserId(userId: number): Promise<Form[]>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, data: Partial<Form>): Promise<Form | undefined>;
  deleteForm(id: number): Promise<boolean>;
  
  // Tutorial methods
  getTutorial(id: number): Promise<Tutorial | undefined>;
  getTutorials(): Promise<Tutorial[]>;
  getTutorialsByType(type: string): Promise<Tutorial[]>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  
  // News methods
  getNews(id: number): Promise<News | undefined>;
  getAllNews(): Promise<News[]>;
  getLatestNews(limit: number): Promise<News[]>;
  createNews(newsItem: InsertNews): Promise<News>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Form methods
  async getForm(id: number): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    return form || undefined;
  }
  
  async getFormsByUserId(userId: number): Promise<Form[]> {
    return await db.select().from(forms).where(eq(forms.userId, userId));
  }
  
  async createForm(insertForm: InsertForm): Promise<Form> {
    const now = new Date();
    const formWithTimestamps = {
      ...insertForm,
      createdAt: now,
      updatedAt: now
    };
    
    const [form] = await db
      .insert(forms)
      .values(formWithTimestamps)
      .returning();
    
    return form;
  }
  
  async updateForm(id: number, data: Partial<Form>): Promise<Form | undefined> {
    const [updatedForm] = await db
      .update(forms)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(forms.id, id))
      .returning();
    
    return updatedForm || undefined;
  }
  
  async deleteForm(id: number): Promise<boolean> {
    const result = await db
      .delete(forms)
      .where(eq(forms.id, id));
    
    return true; // PostgreSQL driver doesn't return rowCount, but we assume success if no exception
  }
  
  // Tutorial methods
  async getTutorial(id: number): Promise<Tutorial | undefined> {
    const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, id));
    return tutorial || undefined;
  }
  
  async getTutorials(): Promise<Tutorial[]> {
    return await db.select().from(tutorials);
  }
  
  async getTutorialsByType(type: string): Promise<Tutorial[]> {
    return await db.select().from(tutorials).where(eq(tutorials.type, type));
  }
  
  async createTutorial(insertTutorial: InsertTutorial): Promise<Tutorial> {
    const tutorialWithTimestamp = {
      ...insertTutorial,
      createdAt: new Date()
    };
    
    const [tutorial] = await db
      .insert(tutorials)
      .values(tutorialWithTimestamp)
      .returning();
    
    return tutorial;
  }
  
  // News methods
  async getNews(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || undefined;
  }
  
  async getAllNews(): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .orderBy(desc(news.publishDate));
  }
  
  async getLatestNews(limit: number): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .orderBy(desc(news.publishDate))
      .limit(limit);
  }
  
  async createNews(insertNews: InsertNews): Promise<News> {
    const newsWithTimestamp = {
      ...insertNews,
      publishDate: new Date()
    };
    
    const [newsItem] = await db
      .insert(news)
      .values(newsWithTimestamp)
      .returning();
    
    return newsItem;
  }
}

// Initialize the database with sample data
async function initializeDatabase() {
  // Check if tutorials exist
  const existingTutorials = await db.select({ count: count() }).from(tutorials);
  if (existingTutorials[0].count === 0) {
    // Sample tutorials for each form type
    const tutorialData: InsertTutorial[] = [
      {
        title: "Come compilare il modello F24 ordinario",
        content: "Guida dettagliata alla compilazione del modello F24 ordinario con esempi pratici.",
        type: "f24-ordinario",
        isVideo: false,
        videoUrl: null
      },
      {
        title: "Guida alla compilazione dell'F24 semplificato",
        content: "Istruzioni passo-passo per la compilazione corretta del modello F24 semplificato.",
        type: "f24-semplificato",
        isVideo: false,
        videoUrl: null
      },
      {
        title: "Video tutorial: Come pagare le imposte con F24",
        content: "Video dimostrativo che illustra come compilare e utilizzare il modello F24.",
        type: "general",
        isVideo: true,
        videoUrl: "https://www.youtube.com/embed/example"
      }
    ];
    
    await db.insert(tutorials).values(tutorialData);
  }
  
  // Check if news exist
  const existingNews = await db.select({ count: count() }).from(news);
  if (existingNews[0].count === 0) {
    // Sample news items
    const newsData: InsertNews[] = [
      {
        title: "Nuove scadenze fiscali: cosa sapere sui pagamenti",
        content: "L'Agenzia delle Entrate ha annunciato nuove scadenze per i pagamenti di alcune imposte. Ecco tutte le informazioni.",
        author: "Team ModuliTax"
      },
      {
        title: "Modifiche alla compilazione dell'F24: le novità",
        content: "Importanti aggiornamenti nella compilazione dei modelli F24. Scopri quali cambiamenti dovrai considerare.",
        author: "Team ModuliTax"
      },
      {
        title: "Incentivi fiscali per le imprese: guida completa",
        content: "Una panoramica completa sugli incentivi fiscali disponibili per le imprese italiane nel 2023.",
        author: "Team ModuliTax"
      }
    ];
    
    await db.insert(news).values(newsData);
  }
}

export const storage = new DatabaseStorage();

// Initialize database with sample data when imported
initializeDatabase().catch(console.error);
