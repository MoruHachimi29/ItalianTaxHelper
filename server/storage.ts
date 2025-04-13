import { users, type User, type InsertUser, forms, type Form, type InsertForm, tutorials, type Tutorial, type InsertTutorial, news, type News, type InsertNews } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private forms: Map<number, Form>;
  private tutorials: Map<number, Tutorial>;
  private newsItems: Map<number, News>;
  
  private userCurrentId: number;
  private formCurrentId: number;
  private tutorialCurrentId: number;
  private newsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.forms = new Map();
    this.tutorials = new Map();
    this.newsItems = new Map();
    
    this.userCurrentId = 1;
    this.formCurrentId = 1;
    this.tutorialCurrentId = 1;
    this.newsCurrentId = 1;
    
    // Initialize with some tutorial data
    this.initializeTutorials();
    
    // Initialize with some news data
    this.initializeNews();
  }

  // Initialize tutorials
  private initializeTutorials() {
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
    
    for (const tutorial of tutorialData) {
      this.createTutorial(tutorial);
    }
  }
  
  // Initialize news
  private initializeNews() {
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
    
    for (const item of newsData) {
      this.createNews(item);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Form methods
  async getForm(id: number): Promise<Form | undefined> {
    return this.forms.get(id);
  }
  
  async getFormsByUserId(userId: number): Promise<Form[]> {
    return Array.from(this.forms.values()).filter(
      (form) => form.userId === userId
    );
  }
  
  async createForm(insertForm: InsertForm): Promise<Form> {
    const id = this.formCurrentId++;
    const now = new Date();
    const form: Form = { 
      ...insertForm, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.forms.set(id, form);
    return form;
  }
  
  async updateForm(id: number, data: Partial<Form>): Promise<Form | undefined> {
    const form = this.forms.get(id);
    if (!form) {
      return undefined;
    }
    
    const updatedForm: Form = {
      ...form,
      ...data,
      updatedAt: new Date()
    };
    
    this.forms.set(id, updatedForm);
    return updatedForm;
  }
  
  async deleteForm(id: number): Promise<boolean> {
    return this.forms.delete(id);
  }
  
  // Tutorial methods
  async getTutorial(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }
  
  async getTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values());
  }
  
  async getTutorialsByType(type: string): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).filter(
      (tutorial) => tutorial.type === type
    );
  }
  
  async createTutorial(insertTutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.tutorialCurrentId++;
    const now = new Date();
    const tutorial: Tutorial = {
      ...insertTutorial,
      id,
      createdAt: now
    };
    this.tutorials.set(id, tutorial);
    return tutorial;
  }
  
  // News methods
  async getNews(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async getAllNews(): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }
  
  async getLatestNews(limit: number): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
      .slice(0, limit);
  }
  
  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.newsCurrentId++;
    const now = new Date();
    const newsItem: News = {
      ...insertNews,
      id,
      publishDate: now
    };
    this.newsItems.set(id, newsItem);
    return newsItem;
  }
}

export const storage = new MemStorage();
