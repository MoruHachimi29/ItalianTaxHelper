import { 
  users, type User, type InsertUser, 
  forms, type Form, type InsertForm, 
  tutorials, type Tutorial, type InsertTutorial, 
  news, type News, type InsertNews,
  blogPosts, type BlogPost, type InsertBlogPost 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and, like, sql, or } from "drizzle-orm";
import seedBlogPosts from "./seed-blog";

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
  
  // Blog methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(page?: number, limit?: number): Promise<{ posts: BlogPost[], totalCount: number }>;
  getBlogPostsByCategory(category: string, page?: number, limit?: number): Promise<{ posts: BlogPost[], totalCount: number }>;
  searchBlogPosts(query: string, page?: number, limit?: number): Promise<{ posts: BlogPost[], totalCount: number }>;
  getLatestBlogPosts(limit: number): Promise<BlogPost[]>;
  getRelatedBlogPosts(postId: number, limit?: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
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
  
  // Blog methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }
  
  async getAllBlogPosts(page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[], totalCount: number }> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const [result] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.isPublished, true));
    const totalCount = Number(result.count);
    
    // Get paginated posts
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit)
      .offset(offset);
    
    return { posts, totalCount };
  }
  
  async getBlogPostsByCategory(category: string, page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[], totalCount: number }> {
    const offset = (page - 1) * limit;
    
    // Get total count for category
    const [result] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(
        eq(blogPosts.category, category),
        eq(blogPosts.isPublished, true)
      ));
    const totalCount = Number(result.count);
    
    // Get paginated posts by category
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.category, category),
        eq(blogPosts.isPublished, true)
      ))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit)
      .offset(offset);
    
    return { posts, totalCount };
  }
  
  async searchBlogPosts(query: string, page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[], totalCount: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    
    // Get total count for search
    const [result] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(and(
        or(
          like(blogPosts.title, searchPattern),
          like(blogPosts.content, searchPattern),
          like(blogPosts.summary, searchPattern),
          sql`${blogPosts.tags}::text LIKE ${searchPattern}`
        ),
        eq(blogPosts.isPublished, true)
      ));
    const totalCount = Number(result.count);
    
    // Get paginated search results
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(
        or(
          like(blogPosts.title, searchPattern),
          like(blogPosts.content, searchPattern),
          like(blogPosts.summary, searchPattern),
          sql`${blogPosts.tags}::text LIKE ${searchPattern}`
        ),
        eq(blogPosts.isPublished, true)
      ))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit)
      .offset(offset);
    
    return { posts, totalCount };
  }
  
  async getLatestBlogPosts(limit: number): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }
  
  async getRelatedBlogPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    // First get the category of the specified post
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, postId));
    
    if (!post) return [];
    
    // Then get other posts from the same category, excluding the original post
    return await db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.category, post.category),
        eq(blogPosts.isPublished, true),
        sql`${blogPosts.id} != ${postId}`
      ))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const postWithTimestamp = {
      ...insertBlogPost,
      publishDate: new Date()
    };
    
    const [post] = await db
      .insert(blogPosts)
      .values(postWithTimestamp)
      .returning();
    
    return post;
  }
  
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    
    return updatedPost || undefined;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    
    return true;
  }
}

// Initialize the database with sample data
async function initializeDatabase() {
  // Funzione per creare date relative all'attuale
  const createDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };
  
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
    // Inserisci news con date diverse
    await db.insert(news).values([
      {
        title: "Nuove scadenze fiscali: cosa sapere sui pagamenti",
        content: "L'Agenzia delle Entrate ha annunciato nuove scadenze per i pagamenti di alcune imposte. Ecco tutte le informazioni.",
        author: "Team ModuliTax",
        publishDate: createDate(0) // Oggi
      },
      {
        title: "Modifiche alla compilazione dell'F24: le novità",
        content: "Importanti aggiornamenti nella compilazione dei modelli F24. Scopri quali cambiamenti dovrai considerare.",
        author: "Team ModuliTax",
        publishDate: createDate(1) // Ieri
      },
      {
        title: "Incentivi fiscali per le imprese: guida completa",
        content: "Una panoramica completa sugli incentivi fiscali disponibili per le imprese italiane nel 2023.",
        author: "Team ModuliTax",
        publishDate: createDate(2) // 2 giorni fa
      },
      {
        title: "Dichiarazione dei Redditi 2025: le nuove tempistiche",
        content: "Il Ministero dell'Economia ha pubblicato le nuove tempistiche per la dichiarazione dei redditi 2025. Ecco cosa cambia per i contribuenti.",
        author: "Redazione Fiscale",
        publishDate: createDate(3) // 3 giorni fa
      },
      {
        title: "Bonus edilizi: tutte le detrazioni disponibili nel 2025",
        content: "Panoramica completa dei bonus edilizi e delle agevolazioni fiscali disponibili per ristrutturazioni e interventi edilizi nell'anno in corso.",
        author: "Marco Rossi",
        publishDate: createDate(4) // 4 giorni fa
      },
      {
        title: "Fatturazione elettronica: novità per professionisti e microimprese",
        content: "Dal 1° gennaio 2025 cambia la normativa sulla fatturazione elettronica per alcune categorie. Scopri se sei interessato dalle modifiche.",
        author: "Paola Bianchi",
        publishDate: createDate(5) // 5 giorni fa
      },
      {
        title: "IVA agevolata: i settori che beneficeranno delle riduzioni",
        content: "Il governo ha approvato nuove aliquote IVA agevolate per alcuni settori strategici. Analisi dettagliata dei benefici e dei settori coinvolti.",
        author: "Andrea Verdi",
        publishDate: createDate(6) // 6 giorni fa
      },
      {
        title: "Scadenze fiscali di aprile 2025: il calendario completo",
        content: "Tutte le scadenze fiscali del mese di aprile 2025: versamenti, comunicazioni e adempimenti da non dimenticare.",
        author: "Team ModuliTax",
        publishDate: createDate(7) // 1 settimana fa
      },
      {
        title: "INPS: nuove aliquote contributive per artigiani e commercianti",
        content: "L'INPS ha aggiornato le aliquote contributive per artigiani e commercianti. Ecco come calcolare i nuovi importi e le scadenze dei versamenti.",
        author: "Luca Ferrari",
        publishDate: createDate(8) // 8 giorni fa
      }
    ]);
  }
  
  // Verifica se ci sono già dei post nel blog
  const existingBlogPosts = await db.select({ count: count() }).from(blogPosts);
  if (existingBlogPosts[0].count === 0) {
    console.log("Nessun post del blog trovato, verranno creati esempi dal seed-blog.ts");
  }
}

export const storage = new DatabaseStorage();

// Inizializza il database con i dati di esempio
initializeDatabase().then(async () => {
  try {
    // Importa e chiama seedBlogPosts se ci sono 0 post blog nel database
    const existingBlogPosts = await db.select({ count: count() }).from(blogPosts);
    if (existingBlogPosts[0].count === 0) {
      // Richiamo il modulo seedBlogPosts
      try {
        const { default: seedBlogPosts } = await import('./seed-blog.js');
        await seedBlogPosts();
        console.log("Seeding dei post blog completato con successo");
      } catch (error) {
        console.error("Errore durante l'importazione del modulo seed-blog:", error);
      }
    }
  } catch (error) {
    console.error("Errore durante il seeding dei post blog:", error);
  }
}).catch(error => {
  console.error("Errore durante l'inizializzazione del database:", error);
});
