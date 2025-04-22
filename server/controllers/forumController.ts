import { Request, Response } from "express";
import { storage } from "../storage";
import { insertForumCategorySchema, insertForumTopicSchema, insertForumPostSchema, insertForumReactionSchema } from "@shared/schema";
import { ZodError } from "zod";
import slugify from "../utils/slugify";

// Utility per creare slug basati sul titolo
const createSlug = (title: string): string => {
  return slugify(title);
};

// FORUM CATEGORIES ENDPOINTS
export const getAllForumCategories = async (req: Request, res: Response) => {
  try {
    const categories = await storage.getAllForumCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching forum categories:", error);
    res.status(500).json({ error: "Errore nel recupero delle categorie del forum" });
  }
};

export const getForumCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await storage.getForumCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ error: "Categoria non trovata" });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching forum category:", error);
    res.status(500).json({ error: "Errore nel recupero della categoria" });
  }
};

export const createForumCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = insertForumCategorySchema.parse(req.body);
    
    // Create slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = createSlug(validatedData.name);
    }
    
    const category = await storage.createForumCategory(validatedData);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error("Error creating forum category:", error);
      res.status(500).json({ error: "Errore nella creazione della categoria" });
    }
  }
};

export const updateForumCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "ID categoria non valido" });
    }
    
    const existingCategory = await storage.getForumCategory(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ error: "Categoria non trovata" });
    }
    
    // Update slug if name changes
    if (req.body.name && req.body.name !== existingCategory.name && !req.body.slug) {
      req.body.slug = createSlug(req.body.name);
    }
    
    const updatedCategory = await storage.updateForumCategory(categoryId, req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating forum category:", error);
    res.status(500).json({ error: "Errore nell'aggiornamento della categoria" });
  }
};

export const deleteForumCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "ID categoria non valido" });
    }
    
    const existingCategory = await storage.getForumCategory(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ error: "Categoria non trovata" });
    }
    
    await storage.deleteForumCategory(categoryId);
    res.status(200).json({ message: "Categoria eliminata con successo" });
  } catch (error) {
    console.error("Error deleting forum category:", error);
    res.status(500).json({ error: "Errore nell'eliminazione della categoria" });
  }
};

// FORUM TOPICS ENDPOINTS
export const getForumTopicsByCategoryId = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const id = parseInt(categoryId);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID categoria non valido" });
    }
    
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const { topics, totalCount } = await storage.getForumTopicsByCategoryId(id, page, limit);
    
    res.status(200).json({
      topics,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching forum topics:", error);
    res.status(500).json({ error: "Errore nel recupero degli argomenti" });
  }
};

export const getForumTopicBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const topic = await storage.getForumTopicBySlug(slug);
    
    if (!topic) {
      return res.status(404).json({ error: "Argomento non trovato" });
    }
    
    // Increment view count
    await storage.incrementForumTopicViewCount(topic.id);
    
    res.status(200).json(topic);
  } catch (error) {
    console.error("Error fetching forum topic:", error);
    res.status(500).json({ error: "Errore nel recupero dell'argomento" });
  }
};

export const createForumTopic = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per creare un argomento" });
    }
    
    const userId = req.user!.id;
    const topicData = { ...req.body, userId };
    
    const validatedData = insertForumTopicSchema.parse(topicData);
    
    // Create slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = createSlug(validatedData.title);
    }
    
    const topic = await storage.createForumTopic(validatedData);
    res.status(201).json(topic);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error("Error creating forum topic:", error);
      res.status(500).json({ error: "Errore nella creazione dell'argomento" });
    }
  }
};

export const updateForumTopic = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per modificare un argomento" });
    }
    
    const { id } = req.params;
    const topicId = parseInt(id);
    
    if (isNaN(topicId)) {
      return res.status(400).json({ error: "ID argomento non valido" });
    }
    
    const existingTopic = await storage.getForumTopic(topicId);
    if (!existingTopic) {
      return res.status(404).json({ error: "Argomento non trovato" });
    }
    
    // Check if user is the creator of the topic
    if (existingTopic.userId !== req.user!.id) {
      return res.status(403).json({ error: "Non hai i permessi per modificare questo argomento" });
    }
    
    // Update slug if title changes
    if (req.body.title && req.body.title !== existingTopic.title && !req.body.slug) {
      req.body.slug = createSlug(req.body.title);
    }
    
    const updatedTopic = await storage.updateForumTopic(topicId, req.body);
    res.status(200).json(updatedTopic);
  } catch (error) {
    console.error("Error updating forum topic:", error);
    res.status(500).json({ error: "Errore nell'aggiornamento dell'argomento" });
  }
};

export const deleteForumTopic = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per eliminare un argomento" });
    }
    
    const { id } = req.params;
    const topicId = parseInt(id);
    
    if (isNaN(topicId)) {
      return res.status(400).json({ error: "ID argomento non valido" });
    }
    
    const existingTopic = await storage.getForumTopic(topicId);
    if (!existingTopic) {
      return res.status(404).json({ error: "Argomento non trovato" });
    }
    
    // Check if user is the creator of the topic
    if (existingTopic.userId !== req.user!.id) {
      return res.status(403).json({ error: "Non hai i permessi per eliminare questo argomento" });
    }
    
    await storage.deleteForumTopic(topicId);
    res.status(200).json({ message: "Argomento eliminato con successo" });
  } catch (error) {
    console.error("Error deleting forum topic:", error);
    res.status(500).json({ error: "Errore nell'eliminazione dell'argomento" });
  }
};

export const searchForumTopics = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: "Parametro di ricerca non valido" });
    }
    
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const { topics, totalCount } = await storage.searchForumTopics(q, page, limit);
    
    res.status(200).json({
      topics,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error searching forum topics:", error);
    res.status(500).json({ error: "Errore nella ricerca degli argomenti" });
  }
};

// FORUM POSTS ENDPOINTS
export const getForumPostsByTopicId = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const id = parseInt(topicId);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID argomento non valido" });
    }
    
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const { posts, totalCount } = await storage.getForumPostsByTopicId(id, page, limit);
    
    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ error: "Errore nel recupero delle risposte" });
  }
};

export const createForumPost = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per pubblicare una risposta" });
    }
    
    const userId = req.user!.id;
    const postData = { ...req.body, userId };
    
    const validatedData = insertForumPostSchema.parse(postData);
    const post = await storage.createForumPost(validatedData);
    
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error("Error creating forum post:", error);
      res.status(500).json({ error: "Errore nella creazione della risposta" });
    }
  }
};

export const updateForumPost = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per modificare una risposta" });
    }
    
    const { id } = req.params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return res.status(400).json({ error: "ID risposta non valido" });
    }
    
    const existingPost = await storage.getForumPost(postId);
    if (!existingPost) {
      return res.status(404).json({ error: "Risposta non trovata" });
    }
    
    // Check if user is the creator of the post
    if (existingPost.userId !== req.user!.id) {
      return res.status(403).json({ error: "Non hai i permessi per modificare questa risposta" });
    }
    
    const updatedPost = await storage.updateForumPost(postId, req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating forum post:", error);
    res.status(500).json({ error: "Errore nell'aggiornamento della risposta" });
  }
};

export const deleteForumPost = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per eliminare una risposta" });
    }
    
    const { id } = req.params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return res.status(400).json({ error: "ID risposta non valido" });
    }
    
    const existingPost = await storage.getForumPost(postId);
    if (!existingPost) {
      return res.status(404).json({ error: "Risposta non trovata" });
    }
    
    // Check if user is the creator of the post
    if (existingPost.userId !== req.user!.id) {
      return res.status(403).json({ error: "Non hai i permessi per eliminare questa risposta" });
    }
    
    await storage.deleteForumPost(postId);
    res.status(200).json({ message: "Risposta eliminata con successo" });
  } catch (error) {
    console.error("Error deleting forum post:", error);
    res.status(500).json({ error: "Errore nell'eliminazione della risposta" });
  }
};

export const markForumPostAsAnswer = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per marcare una risposta come soluzione" });
    }
    
    const { postId } = req.params;
    const id = parseInt(postId);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID risposta non valido" });
    }
    
    const post = await storage.getForumPost(id);
    if (!post) {
      return res.status(404).json({ error: "Risposta non trovata" });
    }
    
    // Get the parent topic
    const topic = await storage.getForumTopic(post.topicId);
    if (!topic) {
      return res.status(404).json({ error: "Argomento non trovato" });
    }
    
    // Check if user is the creator of the topic
    if (topic.userId !== req.user!.id) {
      return res.status(403).json({ error: "Solo l'autore dell'argomento può marcare una risposta come soluzione" });
    }
    
    const updatedPost = await storage.markForumPostAsAnswer(id);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error marking post as answer:", error);
    res.status(500).json({ error: "Errore nel marcare la risposta come soluzione" });
  }
};

// FORUM REACTIONS ENDPOINTS
export const createForumReaction = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per reagire a una risposta" });
    }
    
    const userId = req.user!.id;
    const reactionData = { ...req.body, userId };
    
    const validatedData = insertForumReactionSchema.parse(reactionData);
    const reaction = await storage.createForumReaction(validatedData);
    
    res.status(201).json(reaction);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error("Error creating forum reaction:", error);
      res.status(500).json({ error: "Errore nella creazione della reazione" });
    }
  }
};

export const deleteForumReaction = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Devi effettuare l'accesso per rimuovere una reazione" });
    }
    
    const { id } = req.params;
    const reactionId = parseInt(id);
    
    if (isNaN(reactionId)) {
      return res.status(400).json({ error: "ID reazione non valido" });
    }
    
    const existingReaction = await storage.getForumReaction(reactionId);
    if (!existingReaction) {
      return res.status(404).json({ error: "Reazione non trovata" });
    }
    
    // Check if user is the creator of the reaction
    if (existingReaction.userId !== req.user!.id) {
      return res.status(403).json({ error: "Non hai i permessi per rimuovere questa reazione" });
    }
    
    await storage.deleteForumReaction(reactionId);
    res.status(200).json({ message: "Reazione rimossa con successo" });
  } catch (error) {
    console.error("Error deleting forum reaction:", error);
    res.status(500).json({ error: "Errore nella rimozione della reazione" });
  }
};

export const getForumReactionsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const id = parseInt(postId);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID risposta non valido" });
    }
    
    const reactions = await storage.getForumReactionsByPostId(id);
    res.status(200).json(reactions);
  } catch (error) {
    console.error("Error fetching forum reactions:", error);
    res.status(500).json({ error: "Errore nel recupero delle reazioni" });
  }
};