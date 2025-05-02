import { 
  users, type User, type InsertUser, 
  forms, type Form, type InsertForm, 
  tutorials, type Tutorial, type InsertTutorial, 
  news, type News, type InsertNews,
  blogPosts, type BlogPost, type InsertBlogPost,
  forumCategories, type ForumCategory, type InsertForumCategory,
  forumTopics, type ForumTopic, type InsertForumTopic,
  forumPosts, type ForumPost, type InsertForumPost,
  forumReactions, type ForumReaction, type InsertForumReaction
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
  updateTutorial(id: number, data: Partial<Tutorial>): Promise<Tutorial | undefined>;
  
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
  
  // Forum Category methods
  getForumCategory(id: number): Promise<ForumCategory | undefined>;
  getForumCategoryBySlug(slug: string): Promise<ForumCategory | undefined>;
  getAllForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  updateForumCategory(id: number, data: Partial<ForumCategory>): Promise<ForumCategory | undefined>;
  deleteForumCategory(id: number): Promise<boolean>;
  
  // Forum Topic methods
  getForumTopic(id: number): Promise<ForumTopic | undefined>;
  getForumTopicBySlug(slug: string): Promise<ForumTopic | undefined>;
  getForumTopicsByCategoryId(categoryId: number, page?: number, limit?: number): Promise<{ topics: ForumTopic[], totalCount: number }>;
  searchForumTopics(query: string, page?: number, limit?: number): Promise<{ topics: ForumTopic[], totalCount: number }>;
  getLatestForumTopics(limit: number): Promise<ForumTopic[]>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  updateForumTopic(id: number, data: Partial<ForumTopic>): Promise<ForumTopic | undefined>;
  deleteForumTopic(id: number): Promise<boolean>;
  incrementForumTopicViewCount(id: number): Promise<ForumTopic | undefined>;
  
  // Forum Post methods
  getForumPost(id: number): Promise<ForumPost | undefined>;
  getForumPostsByTopicId(topicId: number, page?: number, limit?: number): Promise<{ posts: ForumPost[], totalCount: number }>;
  getLatestForumPosts(limit: number): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined>;
  deleteForumPost(id: number): Promise<boolean>;
  markForumPostAsAnswer(id: number): Promise<ForumPost | undefined>;
  
  // Forum Reaction methods
  getForumReaction(id: number): Promise<ForumReaction | undefined>;
  getForumReactionsByPostId(postId: number): Promise<ForumReaction[]>;
  getUserReactionToPost(userId: number, postId: number): Promise<ForumReaction | undefined>;
  createForumReaction(reaction: InsertForumReaction): Promise<ForumReaction>;
  deleteForumReaction(id: number): Promise<boolean>;
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
  
  async updateTutorial(id: number, data: Partial<Tutorial>): Promise<Tutorial | undefined> {
    try {
      const [tutorial] = await db
        .update(tutorials)
        .set(data)
        .where(eq(tutorials.id, id))
        .returning();
      return tutorial;
    } catch (error) {
      console.error("Error updating tutorial:", error);
      return undefined;
    }
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
  
  // Forum Category methods
  async getForumCategory(id: number): Promise<ForumCategory | undefined> {
    const [category] = await db.select().from(forumCategories).where(eq(forumCategories.id, id));
    return category || undefined;
  }
  
  async getForumCategoryBySlug(slug: string): Promise<ForumCategory | undefined> {
    const [category] = await db.select().from(forumCategories).where(eq(forumCategories.slug, slug));
    return category || undefined;
  }
  
  async getAllForumCategories(): Promise<ForumCategory[]> {
    return await db
      .select()
      .from(forumCategories)
      .orderBy(forumCategories.order);
  }
  
  async createForumCategory(insertCategory: InsertForumCategory): Promise<ForumCategory> {
    const now = new Date();
    const categoryWithTimestamps = {
      ...insertCategory,
      createdAt: now,
      updatedAt: now
    };
    
    const [category] = await db
      .insert(forumCategories)
      .values(categoryWithTimestamps)
      .returning();
    
    return category;
  }
  
  async updateForumCategory(id: number, data: Partial<ForumCategory>): Promise<ForumCategory | undefined> {
    const [category] = await db
      .update(forumCategories)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(forumCategories.id, id))
      .returning();
    
    return category || undefined;
  }
  
  async deleteForumCategory(id: number): Promise<boolean> {
    await db
      .delete(forumCategories)
      .where(eq(forumCategories.id, id));
    
    return true;
  }
  
  // Forum Topic methods
  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    const [topic] = await db.select().from(forumTopics).where(eq(forumTopics.id, id));
    return topic || undefined;
  }
  
  async getForumTopicBySlug(slug: string): Promise<ForumTopic | undefined> {
    const [topic] = await db.select().from(forumTopics).where(eq(forumTopics.slug, slug));
    return topic || undefined;
  }
  
  async getForumTopicsByCategoryId(categoryId: number, page: number = 1, limit: number = 20): Promise<{ topics: ForumTopic[], totalCount: number }> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const [result] = await db
      .select({ count: count() })
      .from(forumTopics)
      .where(eq(forumTopics.categoryId, categoryId));
    
    const totalCount = Number(result.count);
    
    // Get topics, pinned ones first
    const topics = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.categoryId, categoryId))
      .orderBy(desc(forumTopics.isPinned), desc(forumTopics.lastActivityAt))
      .limit(limit)
      .offset(offset);
    
    return { topics, totalCount };
  }
  
  async searchForumTopics(query: string, page: number = 1, limit: number = 20): Promise<{ topics: ForumTopic[], totalCount: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    
    // Get total count
    const [result] = await db
      .select({ count: count() })
      .from(forumTopics)
      .where(or(
        like(forumTopics.title, searchPattern),
        like(forumTopics.content, searchPattern)
      ));
    
    const totalCount = Number(result.count);
    
    // Get topics
    const topics = await db
      .select()
      .from(forumTopics)
      .where(or(
        like(forumTopics.title, searchPattern),
        like(forumTopics.content, searchPattern)
      ))
      .orderBy(desc(forumTopics.lastActivityAt))
      .limit(limit)
      .offset(offset);
    
    return { topics, totalCount };
  }
  
  async getLatestForumTopics(limit: number): Promise<ForumTopic[]> {
    return await db
      .select()
      .from(forumTopics)
      .orderBy(desc(forumTopics.lastActivityAt))
      .limit(limit);
  }
  
  async createForumTopic(insertTopic: InsertForumTopic): Promise<ForumTopic> {
    const now = new Date();
    const topicWithTimestamps = {
      ...insertTopic,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now
    };
    
    const [topic] = await db
      .insert(forumTopics)
      .values(topicWithTimestamps)
      .returning();
    
    return topic;
  }
  
  async updateForumTopic(id: number, data: Partial<ForumTopic>): Promise<ForumTopic | undefined> {
    const [topic] = await db
      .update(forumTopics)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(forumTopics.id, id))
      .returning();
    
    return topic || undefined;
  }
  
  async deleteForumTopic(id: number): Promise<boolean> {
    await db
      .delete(forumTopics)
      .where(eq(forumTopics.id, id));
    
    return true;
  }
  
  async incrementForumTopicViewCount(id: number): Promise<ForumTopic | undefined> {
    const [topic] = await db
      .update(forumTopics)
      .set({
        viewCount: sql`${forumTopics.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(forumTopics.id, id))
      .returning();
    
    return topic || undefined;
  }
  
  // Forum Post methods
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post || undefined;
  }
  
  async getForumPostsByTopicId(topicId: number, page: number = 1, limit: number = 20): Promise<{ posts: ForumPost[], totalCount: number }> {
    const offset = (page - 1) * limit;
    
    // Get total count
    const [result] = await db
      .select({ count: count() })
      .from(forumPosts)
      .where(eq(forumPosts.topicId, topicId));
    
    const totalCount = Number(result.count);
    
    // Get posts, answers first, then chronological
    const posts = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.topicId, topicId))
      .orderBy(desc(forumPosts.isAnswer), forumPosts.createdAt)
      .limit(limit)
      .offset(offset);
    
    return { posts, totalCount };
  }
  
  async getLatestForumPosts(limit: number): Promise<ForumPost[]> {
    return await db
      .select()
      .from(forumPosts)
      .orderBy(desc(forumPosts.createdAt))
      .limit(limit);
  }
  
  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const now = new Date();
    const postWithTimestamps = {
      ...insertPost,
      createdAt: now,
      updatedAt: now
    };
    
    const [post] = await db
      .insert(forumPosts)
      .values(postWithTimestamps)
      .returning();
    
    // Update the lastActivityAt timestamp on the parent topic
    await db
      .update(forumTopics)
      .set({
        lastActivityAt: now,
        updatedAt: now
      })
      .where(eq(forumTopics.id, insertPost.topicId));
    
    return post;
  }
  
  async updateForumPost(id: number, data: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const [post] = await db
      .update(forumPosts)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(forumPosts.id, id))
      .returning();
    
    return post || undefined;
  }
  
  async deleteForumPost(id: number): Promise<boolean> {
    const [post] = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.id, id));
    
    if (!post) return false;
    
    await db
      .delete(forumPosts)
      .where(eq(forumPosts.id, id));
    
    // Update the lastActivityAt timestamp on the parent topic
    const now = new Date();
    await db
      .update(forumTopics)
      .set({
        lastActivityAt: now,
        updatedAt: now
      })
      .where(eq(forumTopics.id, post.topicId));
    
    return true;
  }
  
  async markForumPostAsAnswer(id: number): Promise<ForumPost | undefined> {
    const [post] = await db
      .update(forumPosts)
      .set({ 
        isAnswer: true,
        updatedAt: new Date()
      })
      .where(eq(forumPosts.id, id))
      .returning();
    
    return post || undefined;
  }
  
  // Forum Reaction methods
  async getForumReaction(id: number): Promise<ForumReaction | undefined> {
    const [reaction] = await db.select().from(forumReactions).where(eq(forumReactions.id, id));
    return reaction || undefined;
  }
  
  async getForumReactionsByPostId(postId: number): Promise<ForumReaction[]> {
    return await db
      .select()
      .from(forumReactions)
      .where(eq(forumReactions.postId, postId));
  }
  
  async getUserReactionToPost(userId: number, postId: number): Promise<ForumReaction | undefined> {
    const [reaction] = await db
      .select()
      .from(forumReactions)
      .where(and(
        eq(forumReactions.userId, userId),
        eq(forumReactions.postId, postId)
      ));
    
    return reaction || undefined;
  }
  
  async createForumReaction(insertReaction: InsertForumReaction): Promise<ForumReaction> {
    // Check if user already reacted to this post
    const existingReaction = await this.getUserReactionToPost(
      insertReaction.userId,
      insertReaction.postId
    );
    
    // If there's an existing reaction of the same type, return it
    if (existingReaction && existingReaction.reactionType === insertReaction.reactionType) {
      return existingReaction;
    }
    
    // If there's an existing reaction of a different type, delete it
    if (existingReaction) {
      await this.deleteForumReaction(existingReaction.id);
    }
    
    // Create the new reaction
    const [reaction] = await db
      .insert(forumReactions)
      .values({
        ...insertReaction,
        createdAt: new Date()
      })
      .returning();
    
    return reaction;
  }
  
  async deleteForumReaction(id: number): Promise<boolean> {
    await db
      .delete(forumReactions)
      .where(eq(forumReactions.id, id));
    
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
  
  // Verifica se ci sono già delle categorie nel forum
  const existingForumCategories = await db.select({ count: count() }).from(forumCategories);
  if (existingForumCategories[0].count === 0) {
    console.log("Inizializzazione delle categorie del forum...");
    const now = new Date();
    
    await db.insert(forumCategories).values([
      {
        name: "F24 e Modulistica Fiscale",
        description: "Discussioni sulla compilazione dei moduli F24, F23 e altre modulistiche fiscali",
        slug: "f24-modulistica-fiscale",
        iconName: "file-text",
        order: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        name: "Novità Fiscali",
        description: "Aggiornamenti, novità e discussioni sugli ultimi sviluppi in ambito fiscale e tributario",
        slug: "novita-fiscali",
        iconName: "newspaper",
        order: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        name: "Partita IVA e Imprese",
        description: "Discussioni per professionisti e imprese: fatturazione, adempimenti e agevolazioni",
        slug: "partita-iva-imprese",
        iconName: "briefcase",
        order: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        name: "Tasse e Imposte",
        description: "Domande e informazioni su IRPEF, IRES, IMU, IRAP e altre imposte",
        slug: "tasse-imposte",
        iconName: "landmark",
        order: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        name: "Aiuto e Consigli",
        description: "Richiedi aiuto per problemi specifici o condividi consigli pratici",
        slug: "aiuto-consigli",
        iconName: "help-circle",
        order: 5,
        createdAt: now,
        updatedAt: now
      }
    ]);
    
    console.log("Categorie del forum inizializzate con successo");
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
