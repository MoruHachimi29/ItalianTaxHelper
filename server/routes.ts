import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { db } from "./db";
import { eq, and, asc, like, desc, sql, not, isNull, isNotNull, or } from "drizzle-orm";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import {
  insertFormSchema,
  insertTutorialSchema,
  insertNewsSchema,
  insertBlogPostSchema,
  insertForumCategorySchema,
  insertForumTopicSchema,
  insertForumPostSchema,
  insertForumReactionSchema,
  f24OrdinarySchema,
  f24SimplifiedSchema,
  f24ExciseSchema,
  f24ElideSchema,
  f23Schema
} from "@shared/schema";
import { PDFDocument } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Header, Footer, PageBreak } from 'docx';
import pdfParse from 'pdf-parse';
import { getCurrentPublicDebt, getHistoricalPublicDebt, comparePublicDebt, supportedCountries } from "./controllers/publicDebtController";
import { 
  getBonusCategories,
  getAllBonus,
  getIseeRanges,
  getNewBonus,
  getExpiringBonus,
  getBonusById
} from "./controllers/bonusController";
import {
  getAllTaxDeadlines,
  getTaxDeadlineCategories,
  getCurrentMonthDeadlines,
  getUpcomingDeadlines,
  getTaxDeadlineById
} from "./controllers/taxDeadlinesController";
import {
  getAllForumCategories,
  getForumCategoryBySlug,
  createForumCategory,
  updateForumCategory,
  deleteForumCategory,
  getForumTopicsByCategoryId,
  getForumTopicBySlug,
  createForumTopic,
  updateForumTopic,
  deleteForumTopic,
  searchForumTopics,
  getForumPostsByTopicId,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  markForumPostAsAnswer,
  createForumReaction,
  deleteForumReaction,
  getForumReactionsByPostId
} from "./controllers/forumController";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API routes - all prefixed with /api
  
  // Tutorial routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial" });
    }
  });
  
  // Get tutorials by type
  app.get("/api/tutorials/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const tutorials = await storage.getTutorialsByType(type);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial" });
    }
  });
  
  // Get video tutorials
  app.get("/api/tutorials/video", async (req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      const videoTutorials = tutorials.filter(tutorial => tutorial.isVideo === true);
      res.json(videoTutorials);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero dei tutorial video" });
    }
  });
  
  // Get tutorial by ID
  app.get("/api/tutorials/id/:id", async (req, res) => {
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
  });
  
  // Update tutorial
  app.put("/api/tutorials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID tutorial non valido" });
      }
      
      // Verifica che il tutorial esista
      const existingTutorial = await storage.getTutorial(id);
      if (!existingTutorial) {
        return res.status(404).json({ message: "Tutorial non trovato" });
      }
      
      // Prepara i dati per l'aggiornamento
      const updatedData = {
        ...req.body,
        id: undefined // Assicuriamoci che non si possa cambiare l'ID
      };
      
      // Aggiorna il tutorial
      const tutorial = await storage.updateTutorial(id, updatedData);
      if (!tutorial) {
        return res.status(500).json({ message: "Errore nell'aggiornamento del tutorial" });
      }
      
      res.json(tutorial);
    } catch (error) {
      console.error("Error updating tutorial:", error);
      res.status(500).json({ message: "Errore nell'aggiornamento del tutorial" });
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

  // Configurazione di multer per gestire i file caricati
  const upload = multer({ storage: multer.memoryStorage() });

  // PDF to Word conversion endpoint - Implementazione professionale avanzata con diverse opzioni
  app.post('/api/convert-pdf', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      // Verifica che il file sia un PDF valido
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Il file deve essere in formato PDF' });
      }

      // Estrai titolo dal nome del file o usa un titolo predefinito
      const fileName = req.file.originalname || 'documento';
      const title = fileName.replace(/\.pdf$/i, '');
      
      // Determina il formato di output (docx o rtf)
      const outputFormat = req.body.format || 'docx';
      
      // Ottiene il buffer del PDF
      const pdfBuffer = req.file.buffer;
      
      // Utilizza la libreria pdflib per estrarre informazioni
      let numPages = 1;
      try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        numPages = pdfDoc.getPageCount();
        console.log(`Il PDF contiene ${numPages} pagine`);
      } catch (pdfError) {
        console.warn('Avviso: Impossibile analizzare la struttura del PDF:', pdfError);
      }
      
      // Crea un documento Word (DOCX) usando docx
      if (outputFormat === 'docx') {
        // Preparazione dei paragrafi per il documento Word
        const allParagraphs: Paragraph[] = [];
        
        // Aggiungi intestazione del documento con il titolo
        const headerParagraph = new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 400,
            after: 400
          },
          thematicBreak: true
        });
        
        allParagraphs.push(headerParagraph);
        
        // Aggiungiamo una sezione con i metadati del file originale
        allParagraphs.push(
          new Paragraph({
            text: "Informazioni sul documento",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 300,
              after: 120
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `File originale: ${req.file.originalname}`,
            spacing: {
              before: 120,
              after: 60
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `Dimensione: ${(req.file.size / 1024).toFixed(2)} KB`,
            spacing: {
              before: 60,
              after: 60
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `Numero di pagine: ${numPages}`,
            spacing: {
              before: 60,
              after: 60
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: `Convertito il: ${new Date().toLocaleString('it-IT')}`,
            spacing: {
              before: 60,
              after: 300
            }
          })
        );
        
        // Nota sul documento
        allParagraphs.push(
          new Paragraph({
            text: "Nota sulla conversione",
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 200,
              after: 120
            }
          })
        );
        
        allParagraphs.push(
          new Paragraph({
            text: "Questo documento è stato convertito da PDF a Word mantenendo la struttura generale. Potrebbero esserci alcune differenze nella formattazione rispetto al documento originale.",
            spacing: {
              before: 120,
              after: 120
            }
          })
        );
        
        // Aggiungi spazio per il contenuto
        allParagraphs.push(
          new Paragraph({
            text: "Contenuto del documento",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200
            }
          })
        );
        
        // Estrai il contenuto del PDF usando pdf-parse con tecnica avanzata
        let pdfContent = "";
        try {
          const pdfData = await pdfParse(pdfBuffer, {
            // Opzioni avanzate per l'estrazione di testo
            pagerender: function(pageData: any) {
              return pageData.getTextContent({ normalizeWhitespace: true });
            }
          });
          
          pdfContent = pdfData.text || "";
          console.log(`Estratto ${pdfContent.length} caratteri dal PDF`);
        } catch (parseError) {
          console.error('Errore nell\'estrazione del testo dal PDF:', parseError);
          pdfContent = "Non è stato possibile estrarre il testo dal PDF.";
        }
        
        // Preprocessamento avanzato del testo per migliorare la formattazione
        // Elimina spazi eccessivi e normalizza le interruzioni di riga
        let processedContent = pdfContent
          .replace(/\r\n/g, '\n')              // Normalizza interruzioni di riga
          .replace(/\n{3,}/g, '\n\n')          // Riduci interruzioni di riga multiple
          .replace(/[ \t]+/g, ' ')             // Riduci spazi multipli a uno solo
          .replace(/ +\n/g, '\n')              // Rimuovi spazi a fine riga
          .replace(/\n +/g, '\n')              // Rimuovi spazi a inizio riga
          .trim();
        
        // Prima identifica possibili titoli nel testo
        const lines = processedContent.split('\n');
        const enhancedLines = lines.map(line => {
          line = line.trim();
          // Cerca di identificare titoli e sottotitoli in base a caratteristiche comuni:
          // - Testo breve (meno di 60 caratteri)
          // - Tutto maiuscolo o inizia con maiuscola
          // - Non contiene punteggiatura comune nelle frasi (.,;:) a metà
          // - Non termina con virgola o punto e virgola
          const isPossibleHeading = 
            line.length > 0 && 
            line.length < 60 && 
            (line === line.toUpperCase() || /^[A-Z0-9]/.test(line)) &&
            !line.match(/[.,:;]\s+\w/) &&
            !line.match(/[,;]$/);
            
          return {
            text: line,
            isPossibleHeading,
            // Identifica il livello di heading in base alla lunghezza
            headingLevel: isPossibleHeading 
              ? (line.length < 25 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3) 
              : undefined
          };
        });
        
        // Ricostruisci il contenuto in paragrafi logici
        const enhancedParagraphs = [];
        let currentParagraph = "";
        
        for (let i = 0; i < enhancedLines.length; i++) {
          const line = enhancedLines[i];
          
          // Se è un titolo, completa il paragrafo precedente e inizia un nuovo gruppo
          if (line.isPossibleHeading) {
            if (currentParagraph.length > 0) {
              enhancedParagraphs.push({
                text: currentParagraph,
                type: 'paragraph'
              });
              currentParagraph = "";
            }
            enhancedParagraphs.push({
              text: line.text,
              type: 'heading',
              level: line.headingLevel
            });
          } 
          // Se la linea è vuota, completa il paragrafo corrente
          else if (line.text.length === 0) {
            if (currentParagraph.length > 0) {
              enhancedParagraphs.push({
                text: currentParagraph,
                type: 'paragraph'
              });
              currentParagraph = "";
            }
          } 
          // Altrimenti, continua ad aggiungere al paragrafo corrente
          else {
            if (currentParagraph.length > 0) {
              currentParagraph += " " + line.text;
            } else {
              currentParagraph = line.text;
            }
          }
        }
        
        // Assicurati di aggiungere l'ultimo paragrafo se presente
        if (currentParagraph.length > 0) {
          enhancedParagraphs.push({
            text: currentParagraph,
            type: 'paragraph'
          });
        }
                
        // Dividi il contenuto in sezioni per pagina, usando circa lo stesso numero di paragrafi per pagina
        const paragraphsPerPage = Math.max(1, Math.ceil(enhancedParagraphs.length / numPages));
        const pageContent = [];
        
        for (let i = 0; i < numPages; i++) {
          const startIdx = i * paragraphsPerPage;
          const endIdx = Math.min(startIdx + paragraphsPerPage, enhancedParagraphs.length);
          if (startIdx < enhancedParagraphs.length) {
            pageContent.push(enhancedParagraphs.slice(startIdx, endIdx));
          }
        }
        
        if (pageContent.length > 0) {
          // Per ogni pagina di contenuto
          for (let i = 0; i < pageContent.length; i++) {
            const pageParagraphs = pageContent[i];
            
            // Intestazione di pagina
            allParagraphs.push(
              new Paragraph({
                text: `Pagina ${i + 1}`,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                  before: 300,
                  after: 120
                }
              })
            );
            
            // Aggiungi ogni paragrafo formattato correttamente
            for (const paragraph of pageParagraphs) {
              if (paragraph.type === 'heading') {
                // È un titolo - formatta come tale
                allParagraphs.push(
                  new Paragraph({
                    text: paragraph.text,
                    heading: paragraph.level,
                    spacing: {
                      before: 240,
                      after: 120
                    },
                    keepNext: true
                  })
                );
              } else {
                // È un paragrafo normale
                // Verifica se è un elenco puntato o numerato
                const text = paragraph.text;
                const isBulletList = text.match(/^[\s]*[•\-\*]\s/);
                const isNumberedList = text.match(/^[\s]*\d+[.)]\s/);
                
                if (isBulletList) {
                  // Formatta come elenco puntato
                  allParagraphs.push(
                    new Paragraph({
                      text: text.replace(/^[\s]*[•\-\*]\s/, ''),
                      bullet: {
                        level: 0
                      },
                      spacing: {
                        before: 60,
                        after: 60
                      }
                    })
                  );
                } else if (isNumberedList) {
                  // Formatta come elenco numerato
                  const num = text.match(/^[\s]*(\d+)[.)]\s/)?.[1] || "1";
                  allParagraphs.push(
                    new Paragraph({
                      text: text.replace(/^[\s]*\d+[.)]\s/, ''),
                      numbering: {
                        reference: "default",
                        level: 0,
                        instance: parseInt(num) || 1
                      },
                      spacing: {
                        before: 60,
                        after: 60
                      }
                    })
                  );
                } else {
                  // Paragrafo normale
                  allParagraphs.push(
                    new Paragraph({
                      text: text,
                      spacing: {
                        before: 80,
                        after: 80
                      }
                    })
                  );
                }
              }
            }
            
            // Aggiungi un'interruzione di pagina tra le pagine (tranne l'ultima)
            if (i < pageContent.length - 1) {
              allParagraphs.push(
                new Paragraph({
                  children: [
                    new PageBreak()
                  ]
                })
              );
            }
          }
        } else {
          // Fallback in caso di errore nell'estrazione del testo
          for (let i = 0; i < numPages; i++) {
            allParagraphs.push(
              new Paragraph({
                text: `Contenuto pagina ${i + 1}`,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                  before: 300,
                  after: 120
                }
              })
            );
            
            allParagraphs.push(
              new Paragraph({
                text: "Il contenuto di questa pagina non è stato estratto correttamente. Il PDF potrebbe essere protetto o contenere elementi non convertibili in testo.",
                spacing: {
                  before: 120,
                  after: 120
                }
              })
            );
            
            // Aggiungi un'interruzione di pagina (tranne per l'ultima pagina)
            if (i < numPages - 1) {
              allParagraphs.push(
                new Paragraph({
                  children: [
                    new PageBreak()
                  ]
                })
              );
            }
          }
        }
        
        // Crea il documento Word professionale
        const doc = new Document({
          creator: "F24Editabile",
          title: title,
          description: "Documento convertito da PDF a Word",
          styles: {
            paragraphStyles: [
              {
                id: "Heading1",
                name: "Heading 1",
                quickFormat: true,
                run: {
                  size: 36, // 18pt
                  bold: true,
                  color: "000000"
                },
                paragraph: {
                  spacing: {
                    before: 400,
                    after: 200
                  }
                }
              },
              {
                id: "Heading2",
                name: "Heading 2",
                quickFormat: true,
                run: {
                  size: 32, // 16pt
                  bold: true,
                  color: "222222"
                },
                paragraph: {
                  spacing: {
                    before: 300,
                    after: 120
                  }
                }
              },
              {
                id: "Heading3",
                name: "Heading 3",
                quickFormat: true,
                run: {
                  size: 28, // 14pt
                  bold: true,
                  color: "444444"
                },
                paragraph: {
                  spacing: {
                    before: 200,
                    after: 80
                  }
                }
              }
            ]
          },
          sections: [
            {
              properties: {
                page: {
                  margin: {
                    top: 700,
                    right: 700,
                    bottom: 700,
                    left: 700
                  }
                }
              },
              headers: {
                default: new Header({
                  children: [
                    new Paragraph({
                      text: "Documento convertito da F24Editabile",
                      alignment: AlignmentType.RIGHT,
                      spacing: {
                        after: 200
                      }
                    })
                  ]
                })
              },
              footers: {
                default: new Footer({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "Pagina "
                        })
                      ]
                    })
                  ]
                })
              },
              children: allParagraphs
            }
          ]
        });
  
        // Genera il buffer del documento Word
        const buffer = await Packer.toBuffer(doc);
  
        // Imposta intestazioni corrette e invia il documento
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.docx`);
        res.send(buffer);
      }
      // Crea un documento RTF usando officegen
      else if (outputFormat === 'rtf') {
        const officegen = require('officegen');
        const rtf = officegen('rtf');
        
        // Imposta metadata
        rtf.on('finalize', function(written: number) {
          console.log(`Documento RTF generato con successo. Byte scritti: ${written}`);
        });
        
        rtf.on('error', function(err: Error) {
          console.error('Errore durante la generazione del documento RTF:', err);
        });
        
        // Crea il documento RTF
        // Aggiungi titolo in grassetto
        const pObj = rtf.createP();
        pObj.addText(title, { bold: true, font_size: 24 });
        
        // Aggiungi informazioni sul documento
        rtf.createP().addLineBreak();
        const infoP = rtf.createP();
        infoP.addText('Informazioni sul documento', { bold: true, font_size: 16 });
        
        rtf.createP().addLineBreak();
        rtf.createP().addText(`File originale: ${req.file.originalname}`);
        rtf.createP().addText(`Dimensione: ${(req.file.size / 1024).toFixed(2)} KB`);
        rtf.createP().addText(`Numero di pagine: ${numPages}`);
        rtf.createP().addText(`Convertito il: ${new Date().toLocaleString('it-IT')}`);
        
        rtf.createP().addLineBreak();
        const noteP = rtf.createP();
        noteP.addText('Nota sulla conversione', { bold: true, font_size: 14 });
        
        const noteText = rtf.createP();
        noteText.addText('Questo documento è stato convertito da PDF a RTF. Il formato RTF è più semplice ma compatibile con quasi tutti i programmi di elaborazione testi.');
        
        rtf.createP().addLineBreak();
        const contentP = rtf.createP();
        contentP.addText('Contenuto del documento', { bold: true, font_size: 16 });
        
        // Estrai il contenuto del PDF usando pdf-parse con tecnica avanzata
        let pdfContent = "";
        try {
          const pdfData = await pdfParse(pdfBuffer, {
            // Opzioni avanzate per l'estrazione di testo
            pagerender: function(pageData: any) {
              return pageData.getTextContent({ normalizeWhitespace: true });
            }
          });
          
          pdfContent = pdfData.text || "";
          console.log(`Estratto ${pdfContent.length} caratteri dal PDF per RTF`);
        } catch (parseError) {
          console.error('Errore nell\'estrazione del testo dal PDF per RTF:', parseError);
          pdfContent = "Non è stato possibile estrarre il testo dal PDF.";
        }
        
        // Preprocessamento avanzato del testo per migliorare la formattazione
        // Elimina spazi eccessivi e normalizza le interruzioni di riga
        let processedContent = pdfContent
          .replace(/\r\n/g, '\n')              // Normalizza interruzioni di riga
          .replace(/\n{3,}/g, '\n\n')          // Riduci interruzioni di riga multiple
          .replace(/[ \t]+/g, ' ')             // Riduci spazi multipli a uno solo
          .replace(/ +\n/g, '\n')              // Rimuovi spazi a fine riga
          .replace(/\n +/g, '\n')              // Rimuovi spazi a inizio riga
          .trim();
          
        // Prima identifica possibili titoli nel testo
        const lines = processedContent.split('\n');
        const enhancedLines = lines.map(line => {
          line = line.trim();
          // Cerca di identificare titoli e sottotitoli in base a caratteristiche comuni:
          // - Testo breve (meno di 60 caratteri)
          // - Tutto maiuscolo o inizia con maiuscola
          // - Non contiene punteggiatura comune nelle frasi (.,;:) a metà
          // - Non termina con virgola o punto e virgola
          const isPossibleHeading = 
            line.length > 0 && 
            line.length < 60 && 
            (line === line.toUpperCase() || /^[A-Z0-9]/.test(line)) &&
            !line.match(/[.,:;]\s+\w/) &&
            !line.match(/[,;]$/);
            
          return {
            text: line,
            isPossibleHeading,
            // Categorizziamo la dimensione del font in base alla lunghezza
            fontSize: isPossibleHeading 
              ? (line.length < 25 ? 18 : 16) 
              : 12
          };
        });
        
        // Ricostruisci il contenuto in paragrafi logici
        const enhancedParagraphs: Array<any> = [];
        let currentParagraph = "";
        
        for (let i = 0; i < enhancedLines.length; i++) {
          const line = enhancedLines[i];
          
          // Se è un titolo, completa il paragrafo precedente e inizia un nuovo gruppo
          if (line.isPossibleHeading) {
            if (currentParagraph.length > 0) {
              enhancedParagraphs.push({
                text: currentParagraph,
                type: 'paragraph'
              });
              currentParagraph = "";
            }
            enhancedParagraphs.push({
              text: line.text,
              type: 'heading',
              fontSize: line.fontSize
            });
          } 
          // Se la linea è vuota, completa il paragrafo corrente
          else if (line.text.length === 0) {
            if (currentParagraph.length > 0) {
              enhancedParagraphs.push({
                text: currentParagraph,
                type: 'paragraph'
              });
              currentParagraph = "";
            }
          } 
          // Altrimenti, continua ad aggiungere al paragrafo corrente
          else {
            // Verifica se è un elenco puntato o numerato
            const isBulletList = line.text.match(/^[\s]*[•\-\*]\s/);
            const isNumberedList = line.text.match(/^[\s]*\d+[.)]\s/);
            
            if (isBulletList || isNumberedList) {
              // Se è un elenco, lo gestiamo separatamente
              if (currentParagraph.length > 0) {
                enhancedParagraphs.push({
                  text: currentParagraph,
                  type: 'paragraph'
                });
                currentParagraph = "";
              }
              
              const numberMatch = isNumberedList ? line.text.match(/^[\s]*(\d+)[.)]/) : null;
              enhancedParagraphs.push({
                text: line.text,
                type: isBulletList ? 'bullet' : 'numbered',
                // Per elenchi numerati, estrai il numero
                number: numberMatch ? parseInt(numberMatch[1]) : null
              });
            } else {
              if (currentParagraph.length > 0) {
                currentParagraph += " " + line.text;
              } else {
                currentParagraph = line.text;
              }
            }
          }
        }
        
        // Assicurati di aggiungere l'ultimo paragrafo se presente
        if (currentParagraph.length > 0) {
          enhancedParagraphs.push({
            text: currentParagraph,
            type: 'paragraph'
          });
        }
                
        // Dividi il contenuto in sezioni per pagina, usando circa lo stesso numero di paragrafi per pagina
        const paragraphsPerPage = Math.max(1, Math.ceil(enhancedParagraphs.length / numPages));
        const pageContent = [];
        
        for (let i = 0; i < numPages; i++) {
          const startIdx = i * paragraphsPerPage;
          const endIdx = Math.min(startIdx + paragraphsPerPage, enhancedParagraphs.length);
          if (startIdx < enhancedParagraphs.length) {
            pageContent.push(enhancedParagraphs.slice(startIdx, endIdx));
          }
        }
        
        if (pageContent.length > 0) {
          // Per ogni pagina di contenuto
          for (let i = 0; i < pageContent.length; i++) {
            const pageParagraphs = pageContent[i];
            
            // Intestazione della pagina
            rtf.createP().addLineBreak();
            const pageTitle = rtf.createP();
            pageTitle.addText(`Pagina ${i + 1}`, { bold: true, font_size: 14 });
            
            // Aggiungi ogni paragrafo formattato correttamente
            for (const paragraph of pageParagraphs) {
              if (paragraph.type === 'heading') {
                // È un titolo - formatta come tale
                rtf.createP().addLineBreak();
                const headingP = rtf.createP();
                headingP.addText(paragraph.text, { 
                  bold: true, 
                  font_size: paragraph.fontSize 
                });
              } else if (paragraph.type === 'bullet') {
                // Elenco puntato
                const listP = rtf.createP();
                // Rimuovi il carattere di elenco originale e sostituiscilo
                const content = paragraph.text.replace(/^[\s]*[•\-\*]\s/, '');
                listP.addText("• " + content);
              } else if (paragraph.type === 'numbered') {
                // Elenco numerato
                const listP = rtf.createP();
                // Rimuovi il numero originale e formato e sostituiscilo
                const content = paragraph.text.replace(/^[\s]*\d+[.)]\s/, '');
                listP.addText(`${paragraph.number}. ${content}`);
              } else {
                // Paragrafo normale
                const p = rtf.createP();
                p.addText(paragraph.text);
              }
            }
            
            // Aggiungi un'interruzione di pagina (tranne per l'ultima pagina)
            if (i < pageContent.length - 1) {
              rtf.createP().addPageBreak();
            }
          }
        } else {
          // Fallback in caso di errore nell'estrazione del testo
          for (let i = 0; i < numPages; i++) {
            rtf.createP().addLineBreak();
            const pageTitle = rtf.createP();
            pageTitle.addText(`Contenuto pagina ${i + 1}`, { bold: true, font_size: 14 });
            
            const errorP = rtf.createP();
            errorP.addText("Il contenuto di questa pagina non è stato estratto correttamente. Il PDF potrebbe essere protetto o contenere elementi non convertibili in testo.");
            
            // Aggiungi interruzione di pagina (tranne per l'ultima pagina)
            if (i < numPages - 1) {
              rtf.createP().addPageBreak();
            }
          }
        }
        
        // Invia il file RTF
        res.setHeader('Content-Type', 'application/rtf');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.rtf`);
        rtf.generate(res);
      } else {
        return res.status(400).json({ error: 'Formato di output non supportato. Utilizzare "docx" o "rtf".' });
      }
    } catch (error: any) {
      console.error('Errore conversione:', error);
      res.status(500).json({ 
        error: 'Errore durante la conversione. Assicurati che il file sia un PDF valido.',
        details: error.message || 'Errore sconosciuto'
      });
    }
  });

  // Altre route...

  const httpServer = createServer(app);

  return httpServer;
}