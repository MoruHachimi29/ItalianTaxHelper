import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the existing template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Tax form related schemas
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'f24-ordinario', 'f24-semplificato', 'f24-accise', 'f24-elide', 'f23'
  data: jsonb("data").notNull(), // JSON data containing all form fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFormSchema = createInsertSchema(forms).pick({
  userId: true,
  type: true,
  data: true
});

export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'f24-ordinario', 'f24-semplificato', 'f24-accise', 'f24-elide', 'f23', 'general'
  isVideo: boolean("is_video").default(false),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTutorialSchema = createInsertSchema(tutorials).pick({
  title: true,
  content: true,
  type: true,
  isVideo: true,
  videoUrl: true
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  author: text("author").notNull(),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  content: true,
  author: true
});

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  author: text("author").notNull(),
  category: text("category").notNull(), // economia, finanza, fisco, lavoro, tecnologia
  tags: text("tags").array(),
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  isPublished: boolean("is_published").default(true),
  metaTitle: text("meta_title"), // SEO optimization
  metaDescription: text("meta_description"), // SEO optimization
  metaKeywords: text("meta_keywords"), // SEO optimization
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  imageUrl: true,
  author: true,
  category: true,
  tags: true,
  isPublished: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true
});

// Define form field schemas for validation
export const f24OrdinarySchema = z.object({
  fiscalCode: z.string().nonempty("Il codice fiscale è obbligatorio"),
  fullName: z.string().nonempty("Nome e cognome sono obbligatori"),
  tributeCode: z.string().nonempty("Il codice tributo è obbligatorio"),
  amount: z.string().regex(/^\d+(\,\d{1,2})?$/, "Formato importo non valido"),
  // Add more fields as needed
});

export const f24SimplifiedSchema = z.object({
  fiscalCode: z.string().nonempty("Il codice fiscale è obbligatorio"),
  fullName: z.string().nonempty("Nome e cognome sono obbligatori"),
  tributeCode: z.string().nonempty("Il codice tributo è obbligatorio"),
  amount: z.string().regex(/^\d+(\,\d{1,2})?$/, "Formato importo non valido"),
  // Add more fields as needed
});

export const f24ExciseSchema = z.object({
  fiscalCode: z.string().nonempty("Il codice fiscale è obbligatorio"),
  fullName: z.string().nonempty("Nome e cognome sono obbligatori"),
  tributeCode: z.string().nonempty("Il codice tributo è obbligatorio"),
  amount: z.string().regex(/^\d+(\,\d{1,2})?$/, "Formato importo non valido"),
  // Add more fields as needed
});

export const f24ElideSchema = z.object({
  fiscalCode: z.string().nonempty("Il codice fiscale è obbligatorio"),
  fullName: z.string().nonempty("Nome e cognome sono obbligatori"),
  tributeCode: z.string().nonempty("Il codice tributo è obbligatorio"),
  amount: z.string().regex(/^\d+(\,\d{1,2})?$/, "Formato importo non valido"),
  // Add more fields as needed
});

export const f23Schema = z.object({
  fiscalCode: z.string().nonempty("Il codice fiscale è obbligatorio"),
  fullName: z.string().nonempty("Nome e cognome sono obbligatori"),
  tributeCode: z.string().nonempty("Il codice tributo è obbligatorio"),
  amount: z.string().regex(/^\d+(\,\d{1,2})?$/, "Formato importo non valido"),
  // Add more fields as needed
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof forms.$inferSelect;

export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Schema per il forum
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  iconName: text("icon_name"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  categoryId: integer("category_id").references(() => forumCategories.id, {
    onDelete: "cascade",
  }),
  userId: integer("user_id").references(() => users.id),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  topicId: integer("topic_id").references(() => forumTopics.id, {
    onDelete: "cascade",
  }),
  userId: integer("user_id").references(() => users.id),
  isAnswer: boolean("is_answer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReactions = pgTable("forum_reactions", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id, {
    onDelete: "cascade",
  }),
  userId: integer("user_id").references(() => users.id),
  reactionType: text("reaction_type").notNull(), // like, helpful, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Definizione degli schemi di inserimento
export const insertForumCategorySchema = createInsertSchema(forumCategories).pick({
  name: true,
  description: true,
  slug: true,
  iconName: true,
  order: true,
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).pick({
  title: true,
  slug: true,
  content: true,
  categoryId: true,
  userId: true,
  isPinned: true,
  isLocked: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  content: true,
  topicId: true,
  userId: true,
  isAnswer: true,
});

export const insertForumReactionSchema = createInsertSchema(forumReactions).pick({
  postId: true,
  userId: true,
  reactionType: true,
});

export type F24Ordinary = z.infer<typeof f24OrdinarySchema>;
export type F24Simplified = z.infer<typeof f24SimplifiedSchema>;
export type F24Excise = z.infer<typeof f24ExciseSchema>;
export type F24Elide = z.infer<typeof f24ElideSchema>;
export type F23 = z.infer<typeof f23Schema>;

// Forum types
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertForumReaction = z.infer<typeof insertForumReactionSchema>;
export type ForumReaction = typeof forumReactions.$inferSelect;
