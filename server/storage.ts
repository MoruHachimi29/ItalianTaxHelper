import { 
  users, type User, type InsertUser, 
  forms, type Form, type InsertForm, 
  tutorials, type Tutorial, type InsertTutorial, 
  news, type News, type InsertNews,
  blogPosts, type BlogPost, type InsertBlogPost 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and, like, sql, or } from "drizzle-orm";

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
  
  // Check if blog posts exist
  const existingBlogPosts = await db.select({ count: count() }).from(blogPosts);
  if (existingBlogPosts[0].count === 0) {
    // Inserisci articoli di blog ottimizzati per SEO
    await db.insert(blogPosts).values([
      {
        title: "Riforma fiscale 2025: Tutte le novità per contribuenti e imprese",
        slug: "riforma-fiscale-2025-novita-contribuenti-imprese",
        summary: "Analisi completa della riforma fiscale 2025: nuove aliquote IRPEF, semplificazioni per le partite IVA e cambiamenti nella tassazione delle rendite finanziarie.",
        content: `
<h2>La nuova riforma fiscale 2025: un quadro completo</h2>

<p>La riforma fiscale approvata dal Parlamento per il 2025 introduce cambiamenti significativi nel sistema tributario italiano, con l'obiettivo di semplificare gli adempimenti e ridurre la pressione fiscale per alcune categorie di contribuenti.</p>

<h3>Nuove aliquote IRPEF: chi ci guadagna</h3>

<p>La riforma riduce da quattro a tre gli scaglioni IRPEF, con un alleggerimento del carico fiscale soprattutto per i redditi medi. Ecco le nuove aliquote:</p>

<ul>
  <li>23% per redditi fino a 28.000 euro (prima era 25% fino a 15.000 euro)</li>
  <li>35% per redditi da 28.001 a 50.000 euro</li>
  <li>43% per redditi superiori a 50.000 euro</li>
</ul>

<p>Questa modifica comporta un risparmio medio di circa 200 euro annui per i contribuenti con redditi tra 15.000 e 28.000 euro.</p>

<h3>Partite IVA: flat tax e semplificazioni</h3>

<p>Per i titolari di partita IVA viene estesa la flat tax al 15% per redditi fino a 85.000 euro (prima il limite era 65.000 euro). Inoltre, sono previste semplificazioni negli adempimenti, con la riduzione delle comunicazioni periodiche e l'introduzione di un sistema di liquidazione dell'IVA precompilato.</p>

<h3>Tassazione delle rendite finanziarie</h3>

<p>La riforma uniforma al 26% la tassazione sulle rendite finanziarie, eliminando l'aliquota agevolata del 12,5% per i titoli di Stato italiani ed europei, che passa al 25%.</p>

<h3>Calendario di attuazione</h3>

<p>Le nuove misure entreranno in vigore gradualmente durante il 2025, con l'applicazione completa prevista per gennaio 2026. I decreti attuativi sono attesi entro marzo 2025.</p>

<h2>Conclusioni</h2>

<p>La riforma fiscale 2025 rappresenta un tentativo di modernizzazione del sistema tributario italiano, con vantaggi per i redditi medi e semplificazioni per le attività produttive. Tuttavia, alcuni analisti evidenziano criticità nella copertura finanziaria delle misure e nel trattamento dei redditi più alti.</p>
        `,
        imageUrl: "https://example.com/images/riforma-fiscale-2025.jpg",
        author: "Dott. Mario Rossi",
        category: "fisco",
        tags: ["riforma fiscale", "irpef", "tasse", "partite iva", "2025"],
        publishDate: createDate(0),
        isPublished: true,
        metaTitle: "Riforma Fiscale 2025: Novità, Aliquote e Vantaggi per Contribuenti e Imprese",
        metaDescription: "Scopri tutte le novità della riforma fiscale 2025: nuove aliquote IRPEF, agevolazioni per partite IVA e modifiche alla tassazione delle rendite finanziarie.",
        metaKeywords: "riforma fiscale 2025, nuove aliquote irpef, flat tax partite iva, tassazione rendite finanziarie, semplificazioni fiscali"
      },
      {
        title: "Fatturazione elettronica 2025: Guida completa ai nuovi obblighi e alle semplificazioni",
        slug: "fatturazione-elettronica-2025-guida-completa-obblighi-semplificazioni",
        summary: "Dal 1° gennaio 2025 cambiano le regole della fatturazione elettronica per professionisti e microimprese. Ecco tutto quello che devi sapere per essere in regola.",
        content: `
<h2>Fatturazione elettronica: le novità del 2025</h2>

<p>Con il nuovo anno fiscale, il sistema di fatturazione elettronica in Italia subisce importanti modifiche che interessano professionisti, microimprese e regime forfettario. Questa guida ti aiuterà a comprendere i nuovi obblighi e le opportunità di semplificazione.</p>

<h3>Chi è obbligato alla fatturazione elettronica dal 2025</h3>

<p>Dal 1° gennaio 2025, l'obbligo di emissione di fatture elettroniche si estende a:</p>

<ul>
  <li>Tutti i contribuenti in regime forfettario, indipendentemente dal volume d'affari</li>
  <li>Associazioni sportive dilettantistiche con ricavi fino a 65.000 euro</li>
  <li>Operatori sanitari per tutte le prestazioni, anche quelle non convenzionate con il SSN</li>
</ul>

<h3>Le nuove tempistiche di emissione</h3>

<p>Con le modifiche introdotte, il termine per l'emissione delle fatture elettroniche immediate passa da 12 a 10 giorni dall'effettuazione dell'operazione. Per le fatture differite, rimane la scadenza del giorno 15 del mese successivo.</p>

<h3>Nuove specifiche tecniche</h3>

<p>Il formato XML delle fatture elettroniche si aggiorna con l'introduzione di nuovi campi obbligatori:</p>

<ul>
  <li>Tipo documento esteso (con nuovi codici per identificare le diverse tipologie di operazioni)</li>
  <li>Natura dell'operazione più dettagliata (con codici specifici per ogni tipologia di esenzione/esclusione IVA)</li>
  <li>Riferimenti normativi obbligatori per le operazioni non imponibili</li>
</ul>

<h3>Semplificazioni e vantaggi</h3>

<p>A fronte dei nuovi obblighi, vengono introdotte alcune semplificazioni:</p>

<ul>
  <li>Abolizione dell'esterometro trimestrale per le operazioni transfrontaliere</li>
  <li>Precompilazione dei registri IVA da parte dell'Agenzia delle Entrate</li>
  <li>Riduzione dei termini di accertamento da 5 a 4 anni per i soggetti che garantiscono la tracciabilità dei pagamenti</li>
</ul>

<h3>Software e strumenti disponibili</h3>

<p>Per adeguarsi alle nuove regole, è possibile utilizzare:</p>

<ul>
  <li>Il portale gratuito "Fatture e Corrispettivi" dell'Agenzia delle Entrate</li>
  <li>Software gestionali aggiornati alle nuove specifiche</li>
  <li>App per dispositivi mobili per l'emissione rapida delle fatture</li>
</ul>

<h2>Conclusioni e prossimi passi</h2>

<p>La fatturazione elettronica 2025 rappresenta un ulteriore passo verso la digitalizzazione completa del sistema fiscale italiano. Per evitare sanzioni e problemi, è fondamentale aggiornare i propri sistemi e procedure entro la fine del 2024.</p>
        `,
        imageUrl: "https://example.com/images/fatturazione-elettronica-2025.jpg",
        author: "Dott.ssa Laura Bianchi",
        category: "fisco",
        tags: ["fatturazione elettronica", "e-fattura", "regime forfettario", "agenzia entrate", "adempimenti fiscali"],
        publishDate: createDate(1),
        isPublished: true,
        metaTitle: "Fatturazione Elettronica 2025: Nuovi Obblighi e Semplificazioni | Guida Completa",
        metaDescription: "Dal 1° gennaio 2025 cambiano le regole della fatturazione elettronica. Scopri i nuovi obblighi, le semplificazioni e come adeguarti alle novità.",
        metaKeywords: "fatturazione elettronica 2025, e-fattura obbligatoria, forfettari, nuove regole fattura elettronica, xml fattura, semplificazioni fiscali"
      },
      {
        title: "Investimenti sostenibili: Come la finanza verde sta cambiando l'economia italiana",
        slug: "investimenti-sostenibili-finanza-verde-economia-italiana",
        summary: "Gli investimenti sostenibili stanno rivoluzionando il panorama economico italiano. Scopri le opportunità, i rendimenti e il futuro della finanza ESG in Italia.",
        content: `
<h2>La rivoluzione verde della finanza italiana</h2>

<p>Negli ultimi anni, gli investimenti sostenibili hanno registrato una crescita esponenziale in Italia, trasformando profondamente il mercato finanziario e creando nuove opportunità per investitori e imprese.</p>

<h3>Cosa sono gli investimenti ESG</h3>

<p>Gli investimenti ESG (Environmental, Social and Governance) integrano considerazioni ambientali, sociali e di buona governance nella valutazione e selezione degli investimenti. In Italia, questo approccio ha visto una crescita del 27% nel 2024, con un valore complessivo di oltre 45 miliardi di euro.</p>

<h3>I rendimenti della finanza sostenibile</h3>

<p>Contrariamente a quanto si poteva pensare in passato, i dati mostrano che gli investimenti sostenibili non comportano necessariamente una rinuncia al rendimento:</p>

<ul>
  <li>Nel triennio 2022-2024, i fondi ESG italiani hanno registrato rendimenti medi dell'8,3%, contro il 7,9% dei fondi tradizionali</li>
  <li>Le aziende con elevati rating di sostenibilità hanno mostrato una volatilità inferiore durante le crisi di mercato</li>
  <li>Il premio di rischio per gli investimenti green si è ridotto, indicando una maggiore maturità di questo segmento</li>
</ul>

<h3>Le normative che guidano il cambiamento</h3>

<p>Il quadro normativo europeo e italiano sta accelerando la transizione verso una finanza più sostenibile:</p>

<ul>
  <li>La Sustainable Finance Disclosure Regulation (SFDR) impone requisiti di trasparenza per gli investimenti sostenibili</li>
  <li>La tassonomia UE definisce criteri oggettivi per classificare le attività economiche come sostenibili</li>
  <li>Il Piano Nazionale di Ripresa e Resilienza (PNRR) destina oltre 60 miliardi di euro a progetti legati alla transizione ecologica</li>
</ul>

<h3>Opportunità di investimento per i risparmiatori italiani</h3>

<p>I risparmiatori italiani hanno oggi diverse opzioni per orientare i propri investimenti verso la sostenibilità:</p>

<ul>
  <li>Fondi comuni di investimento ESG</li>
  <li>ETF tematici focalizzati su energie rinnovabili, economia circolare o mobilità sostenibile</li>
  <li>Green bond e social bond, emessi da aziende, banche e governi</li>
  <li>Investimenti diretti in startup innovative nel settore della sostenibilità</li>
</ul>

<h3>Il futuro della finanza sostenibile in Italia</h3>

<p>Le previsioni per il futuro indicano un'ulteriore accelerazione della finanza sostenibile in Italia:</p>

<ul>
  <li>Entro il 2027, si stima che oltre il 50% degli investimenti italiani includerà criteri ESG</li>
  <li>Le banche stanno rapidamente sviluppando expertise interna sulla valutazione dei rischi climatici</li>
  <li>La domanda di consulenza specializzata in investimenti sostenibili è in forte crescita</li>
</ul>

<h2>Conclusioni</h2>

<p>La finanza sostenibile rappresenta non solo un'opportunità di investimento, ma anche un potente strumento per guidare la transizione verso un'economia più equa e rispettosa dell'ambiente. Per l'Italia, questo trend offre la possibilità di modernizzare il proprio sistema produttivo e finanziario, allineandolo agli obiettivi europei di neutralità climatica.</p>
        `,
        imageUrl: "https://example.com/images/finanza-sostenibile.jpg",
        author: "Dott. Andrea Verdi",
        category: "finanza",
        tags: ["investimenti sostenibili", "ESG", "finanza verde", "green bond", "fondi sostenibili", "PNRR"],
        publishDate: createDate(2),
        isPublished: true,
        metaTitle: "Investimenti Sostenibili in Italia: Guida alla Finanza Verde e ESG",
        metaDescription: "Scopri come gli investimenti sostenibili stanno trasformando l'economia italiana: opportunità, rendimenti e futuro della finanza ESG per risparmiatori e imprese.",
        metaKeywords: "investimenti sostenibili, finanza ESG, green bond, fondi sostenibili, finanza verde, PNRR, investimenti ecologici"
      },
      {
        title: "Intelligenza Artificiale nel settore finanziario: Opportunità e sfide per banche e assicurazioni",
        slug: "intelligenza-artificiale-settore-finanziario-banche-assicurazioni",
        summary: "L'intelligenza artificiale sta rivoluzionando il settore finanziario italiano. Ecco come banche e assicurazioni stanno implementando soluzioni AI e quali sfide devono affrontare.",
        content: `
<h2>La rivoluzione dell'AI nel settore finanziario italiano</h2>

<p>L'intelligenza artificiale (AI) sta trasformando radicalmente il settore finanziario italiano, offrendo nuove opportunità per migliorare l'efficienza operativa, ridurre i costi e offrire servizi personalizzati ai clienti.</p>

<h3>Come le banche italiane utilizzano l'AI</h3>

<p>Le principali istituzioni finanziarie italiane hanno implementato soluzioni di AI in diverse aree:</p>

<ul>
  <li><strong>Servizio clienti</strong>: Chatbot e assistenti virtuali che gestiscono richieste di base, con una copertura 24/7</li>
  <li><strong>Analisi del rischio</strong>: Algoritmi che valutano il merito creditizio in pochi secondi, analizzando centinaia di variabili</li>
  <li><strong>Rilevamento frodi</strong>: Sistemi di machine learning che identificano transazioni sospette in tempo reale, riducendo le frodi del 27% in media</li>
  <li><strong>Consulenza automatizzata</strong>: Robo-advisor che offrono raccomandazioni di investimento personalizzate a costi ridotti</li>
</ul>

<h3>Le applicazioni dell'AI nel settore assicurativo</h3>

<p>Anche il settore assicurativo sta beneficiando dell'intelligenza artificiale:</p>

<ul>
  <li><strong>Personalizzazione delle polizze</strong>: Tariffe basate sui comportamenti individuali rilevati tramite IoT e telematics</li>
  <li><strong>Gestione sinistri</strong>: Valutazione automatizzata dei danni utilizzando computer vision, con riduzione dei tempi di gestione del 40%</li>
  <li><strong>Prevenzione</strong>: Analisi predittiva per identificare situazioni di rischio prima che si verifichino i sinistri</li>
  <li><strong>Contrasto alle frodi</strong>: Identificazione di pattern sospetti nelle richieste di risarcimento</li>
</ul>

<h3>Le sfide regolamentari e etiche</h3>

<p>L'implementazione dell'AI nel settore finanziario solleva importanti questioni:</p>

<ul>
  <li><strong>Trasparenza algoritmica</strong>: L'European AI Act richiede che le decisioni automatizzate siano spiegabili e verificabili</li>
  <li><strong>Protezione dei dati</strong>: Conformità con il GDPR e le nuove normative sulla privacy</li>
  <li><strong>Bias e discriminazione</strong>: Rischio che gli algoritmi perpetuino o amplifichino pregiudizi esistenti</li>
  <li><strong>Digital divide</strong>: Necessità di garantire l'accesso ai servizi finanziari anche a chi ha limitate competenze digitali</li>
</ul>

<h3>Il futuro dell'AI nella finanza italiana</h3>

<p>Le prospettive per i prossimi anni indicano un'accelerazione nell'adozione dell'AI:</p>

<ul>
  <li>Investimenti in tecnologie AI nel settore finanziario italiano stimati in 2,7 miliardi di euro nel 2026</li>
  <li>Diffusione di soluzioni di open banking potenziate dall'AI</li>
  <li>Convergenza tra fintech e istituzioni tradizionali attraverso partnership strategiche</li>
  <li>Sviluppo di soluzioni di finanza embedded basate su AI</li>
</ul>

<h2>Conclusioni</h2>

<p>L'intelligenza artificiale rappresenta una trasformazione fondamentale per il settore finanziario italiano, con potenziali benefici in termini di efficienza, personalizzazione e inclusione finanziaria. Tuttavia, per sfruttare pienamente queste opportunità, sarà necessario affrontare le sfide etiche e regolamentari, garantendo che l'innovazione tecnologica sia accompagnata da adeguate tutele per i consumatori.</p>
        `,
        imageUrl: "https://example.com/images/ai-finance.jpg",
        author: "Prof. Giovanni Neri",
        category: "tecnologia",
        tags: ["intelligenza artificiale", "fintech", "banche", "assicurazioni", "robo-advisor", "machine learning"],
        publishDate: createDate(3),
        isPublished: true,
        metaTitle: "Intelligenza Artificiale nel Settore Finanziario: Rivoluzione per Banche e Assicurazioni",
        metaDescription: "Scopri come l'AI sta trasformando banche e assicurazioni in Italia: applicazioni, vantaggi, sfide etiche e prospettive future dell'intelligenza artificiale nella finanza.",
        metaKeywords: "intelligenza artificiale finanza, AI banche, fintech, robo-advisor, machine learning assicurazioni, AI servizi finanziari"
      },
      {
        title: "Mercato del lavoro italiano: Tendenze, opportunità e sfide per il 2025",
        slug: "mercato-lavoro-italiano-tendenze-opportunita-sfide-2025",
        summary: "Analisi completa del mercato del lavoro italiano per il 2025: settori in crescita, competenze richieste, nuove forme di lavoro e strategie per candidati e aziende.",
        content: `
<h2>Il mercato del lavoro italiano nel 2025: un'analisi delle tendenze</h2>

<p>Il mercato del lavoro italiano sta attraversando una fase di profonda trasformazione, influenzata da digitalizzazione, transizione ecologica e cambiamenti demografici. Questa analisi offre una panoramica delle principali tendenze e opportunità per lavoratori e imprese.</p>

<h3>I settori in crescita</h3>

<p>Diversi settori mostrano segnali di forte espansione e opportunità occupazionali:</p>

<ul>
  <li><strong>Tecnologia e digitale</strong>: Si prevede un fabbisogno di oltre 95.000 professionisti IT entro il 2025, con particolare richiesta di esperti in cybersecurity, data science e sviluppo software</li>
  <li><strong>Green economy</strong>: Il settore delle energie rinnovabili e dell'economia circolare genererà circa 75.000 nuovi posti di lavoro nei prossimi tre anni</li>
  <li><strong>Sanità e assistenza</strong>: L'invecchiamento della popolazione aumenta la domanda di professionisti sanitari e assistenziali, con 120.000 posizioni da coprire</li>
  <li><strong>Turismo sostenibile</strong>: La ripresa del settore turistico punta sulla sostenibilità e sull'esperienza personalizzata, creando 50.000 nuove opportunità</li>
</ul>

<h3>Le competenze più richieste</h3>

<p>Il mercato premia sempre più determinate competenze trasversali e tecniche:</p>

<ul>
  <li><strong>Competenze digitali</strong>: Non solo per ruoli tecnici, ma come requisito di base per quasi tutte le posizioni</li>
  <li><strong>Sostenibilità</strong>: Conoscenze in ambito ESG e economia circolare</li>
  <li><strong>Soft skills</strong>: Problem solving, pensiero critico, adattabilità e intelligenza emotiva</li>
  <li><strong>Multilinguismo</strong>: Inglese e una seconda lingua straniera sono sempre più richiesti</li>
</ul>

<h3>Nuove forme di lavoro</h3>

<p>La pandemia ha accelerato l'evoluzione di nuovi modelli lavorativi:</p>

<ul>
  <li><strong>Lavoro ibrido</strong>: Il 58% delle aziende italiane ha adottato modelli che combinano presenza in ufficio e lavoro da remoto</li>
  <li><strong>Nomadismo digitale</strong>: Aumentano i professionisti che lavorano da località diverse, attratti anche dai nuovi visti per nomadi digitali</li>
  <li><strong>Gig economy qualificata</strong>: Cresce il numero di professionisti altamente specializzati che offrono consulenze a progetto</li>
  <li><strong>Settimana corta</strong>: Il 12% delle aziende italiane sta sperimentando la settimana lavorativa di 4 giorni</li>
</ul>

<h3>Le sfide da affrontare</h3>

<p>Persistono importanti criticità strutturali nel mercato del lavoro italiano:</p>

<ul>
  <li><strong>Mismatch di competenze</strong>: Il 48% delle aziende fatica a trovare candidati con le competenze necessarie</li>
  <li><strong>Divario di genere</strong>: Il tasso di occupazione femminile resta al 51,3%, ben al di sotto della media europea</li>
  <li><strong>Invecchiamento della forza lavoro</strong>: L'età media dei lavoratori italiani è salita a 45,9 anni</li>
  <li><strong>Fuga dei talenti</strong>: Ogni anno circa 120.000 giovani qualificati lasciano l'Italia</li>
</ul>

<h3>Strategie per lavoratori e aziende</h3>

<p>Per navigare efficacemente le trasformazioni in corso:</p>

<ul>
  <li><strong>Per i lavoratori</strong>: Investire nella formazione continua, costruire un personal brand digitale, sviluppare resilienza e adattabilità</li>
  <li><strong>Per le aziende</strong>: Adottare politiche di upskilling e reskilling, implementare strategie di employer branding, promuovere diversity & inclusion, offrire modelli di lavoro flessibili</li>
</ul>

<h2>Conclusioni</h2>

<p>Il mercato del lavoro italiano del 2025 offrirà significative opportunità per chi saprà cogliere le tendenze emergenti e sviluppare le competenze richieste. Al contempo, richiederà una maggiore flessibilità e capacità di adattamento, sia da parte dei lavoratori che delle organizzazioni.</p>
        `,
        imageUrl: "https://example.com/images/mercato-lavoro-2025.jpg",
        author: "Dott.ssa Elena Ferrari",
        category: "lavoro",
        tags: ["mercato del lavoro", "occupazione", "competenze", "smart working", "green jobs", "lavoro digitale"],
        publishDate: createDate(4),
        isPublished: true,
        metaTitle: "Mercato del Lavoro Italiano 2025: Tendenze, Opportunità e Competenze Richieste",
        metaDescription: "Analisi completa del mercato del lavoro in Italia per il 2025: settori in crescita, competenze più richieste, nuove forme di lavoro e strategie per affrontare le sfide future.",
        metaKeywords: "mercato lavoro 2025, occupazione italia, lavoro del futuro, competenze richieste, green jobs, lavoro digitale, smart working"
      }
    ]);
  }
}

export const storage = new DatabaseStorage();

// Initialize database with sample data when imported
initializeDatabase().catch(console.error);
