import { db } from "./db";
import { blogPosts, users, forms, tutorials, news } from "@shared/schema";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  console.log("Inizializzazione reset del database...");
  
  try {
    // Elimina tutti i dati dalle tabelle
    console.log("Eliminazione dei dati esistenti...");
    await db.delete(blogPosts);
    await db.delete(news);
    await db.delete(tutorials);
    await db.delete(forms);
    await db.delete(users);
    
    console.log("Database resettato con successo!");
    console.log("Il database verrà ripopolato automaticamente al riavvio del server");
    
    // Resetta le sequenze degli ID se necessario
    await db.execute(sql`ALTER SEQUENCE IF EXISTS blog_posts_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE IF EXISTS news_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE IF EXISTS tutorials_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE IF EXISTS forms_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1`);
    
    process.exit(0);
  } catch (error) {
    console.error("Errore durante il reset del database:", error);
    process.exit(1);
  }
}

// Esegui la funzione
resetDatabase();