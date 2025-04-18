import { Request, Response } from "express";
import { storage } from "../storage";
import { Tutorial, insertTutorialSchema } from "@shared/schema";
import { z } from "zod";

/**
 * Recupera tutti i tutorial disponibili
 */
export const getAllTutorials = async (req: Request, res: Response) => {
  try {
    const tutorials = await storage.getTutorials();
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei tutorial" });
  }
};

/**
 * Recupera i tutorial per tipo specifico
 */
export const getTutorialsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const tutorials = await storage.getTutorialsByType(type);
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei tutorial" });
  }
};

/**
 * Recupera un tutorial specifico per ID
 */
export const getTutorialById = async (req: Request, res: Response) => {
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
};

/**
 * Crea un nuovo tutorial
 */
export const createTutorial = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = insertTutorialSchema.parse(req.body);
    
    // Create tutorial
    const tutorial = await storage.createTutorial(validatedData);
    
    res.status(201).json(tutorial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Dati tutorial non validi", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Errore nella creazione del tutorial" });
  }
};

/**
 * Recupera i tutorial video
 */
export const getVideoTutorials = async (req: Request, res: Response) => {
  try {
    const tutorials = await storage.getTutorials();
    const videoTutorials = tutorials.filter(tutorial => tutorial.isVideo === true);
    res.json(videoTutorials);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei tutorial video" });
  }
};