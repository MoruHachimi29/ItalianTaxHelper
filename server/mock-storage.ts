// Questo file sostituisce l'utilizzo del database con un mock in memoria

// Creiamo dei dati statici in-memory
const mockTutorials = [
  {
    id: 1,
    title: "Come compilare il modello F24 ordinario",
    description: "Guida completa alla compilazione del modello F24 ordinario",
    videoUrl: "https://youtu.be/example1",
    thumbnailUrl: "/assets/thumbnail1.jpg",
    content: "Contenuto dettagliato della guida...",
    type: "video",
    formType: "f24-ordinario",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: "Guida al modello F24 semplificato",
    description: "Tutte le istruzioni per compilare correttamente il modello F24 semplificato",
    videoUrl: "https://youtu.be/example2",
    thumbnailUrl: "/assets/thumbnail2.jpg",
    content: "Contenuto dettagliato della guida...",
    type: "video",
    formType: "f24-semplificato",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: "F24 Accise: istruzioni per l'uso",
    description: "Procedura completa per la compilazione del modello F24 Accise",
    videoUrl: null,
    thumbnailUrl: null,
    content: "Contenuto dettagliato della guida testuale...",
    type: "text",
    formType: "f24-accise",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockNews = [
  {
    id: 1,
    title: "Nuove scadenze fiscali: cosa sapere",
    content: "Il governo ha annunciato le nuove scadenze fiscali per l'anno in corso...",
    publishDate: new Date(),
    author: "Redazione F24Editabile",
    imageUrl: null,
    tags: ["scadenze", "fisco", "tasse"]
  },
  {
    id: 2,
    title: "Aggiornamenti sul modello F24: novità 2025",
    content: "Nel 2025 saranno introdotte importanti modifiche al modello F24...",
    publishDate: new Date(),
    author: "Redazione F24Editabile",
    imageUrl: null,
    tags: ["f24", "novità", "2025"] 
  }
];

const mockForumCategories = [
  {
    id: 1,
    name: "F24 e Modulistica Fiscale",
    description: "Discussioni su F24 ordinario, semplificato, accise, elide e F23",
    slug: "f24-modulistica-fiscale",
    iconName: "file-text",
    order: 1
  },
  {
    id: 2,
    name: "Novità Fiscali",
    description: "Aggiornamenti e novità in ambito fiscale e tributario",
    slug: "novita-fiscali",
    iconName: "bell",
    order: 2
  },
  {
    id: 3, 
    name: "Partita IVA e Imprese",
    description: "Argomenti per professionisti, freelance e aziende",
    slug: "partita-iva-imprese",
    iconName: "briefcase",
    order: 3
  },
  {
    id: 4,
    name: "Tasse e Imposte",
    description: "Domande e discussioni su IRPEF, IVA, IRAP e altre imposte",
    slug: "tasse-imposte",
    iconName: "landmark",
    order: 4
  },
  {
    id: 5,
    name: "Aiuto e Consigli",
    description: "Richieste di supporto e consigli generali",
    slug: "aiuto-consigli",
    iconName: "help-circle",
    order: 5
  }
];

const mockForumTopics = [
  {
    id: 1,
    title: "Come compilare l'F24 per la prima casa?",
    slug: "come-compilare-f24-prima-casa",
    content: "Buongiorno, devo pagare le imposte relative all'acquisto della prima casa. Come devo compilare il modello F24? Quali sono i codici tributo da utilizzare?",
    categoryId: 1,
    userId: 1,
    isPinned: false,
    isLocked: false,
    viewCount: 120,
    lastActivityAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: "Differenze tra F24 semplificato e ordinario",
    slug: "differenze-f24-semplificato-ordinario",
    content: "Potete spiegarmi quali sono le differenze principali tra il modello F24 semplificato e quello ordinario? In quali casi conviene usare l'uno o l'altro?",
    categoryId: 1,
    userId: 2,
    isPinned: true,
    isLocked: false,
    viewCount: 350,
    lastActivityAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: "Nuove aliquote IRPEF 2025",
    slug: "nuove-aliquote-irpef-2025",
    content: "Avete informazioni sulle nuove aliquote IRPEF annunciate per il 2025? Come cambieranno rispetto a quelle attuali?",
    categoryId: 2,
    userId: 3,
    isPinned: false,
    isLocked: false,
    viewCount: 280,
    lastActivityAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Esporta funzioni mock per sostituire l'accesso al database
// Queste funzioni simulano quelle originali ma restituiscono dati statici

// Tutorial methods
export async function getTutorial(id: number) {
  return mockTutorials.find(t => t.id === id);
}

export async function getTutorials() {
  return mockTutorials;
}

export async function getTutorialsByType(type: string) {
  return mockTutorials.filter(t => t.type === type);
}

export async function createTutorial(tutorial: any) {
  const newTutorial = {
    id: mockTutorials.length + 1,
    ...tutorial,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockTutorials.push(newTutorial);
  return newTutorial;
}

// News methods
export async function getNews(id: number) {
  return mockNews.find(n => n.id === id);
}

export async function getAllNews() {
  return mockNews;
}

export async function getLatestNews(limit: number) {
  return mockNews.slice(0, limit);
}

export async function createNews(news: any) {
  const newNews = {
    id: mockNews.length + 1,
    ...news,
    publishDate: new Date()
  };
  mockNews.push(newNews);
  return newNews;
}

// Forum Category methods
export async function getAllForumCategories() {
  return mockForumCategories;
}

export async function getForumCategoryBySlug(slug: string) {
  return mockForumCategories.find(c => c.slug === slug);
}

// Forum Topic methods
export async function getForumTopicsByCategoryId(categoryId: number, page: number = 1, limit: number = 20) {
  const topics = mockForumTopics.filter(t => t.categoryId === categoryId);
  const start = (page - 1) * limit;
  const end = start + limit;
  return { 
    topics: topics.slice(start, end),
    totalCount: topics.length
  };
}

export async function getForumPostsByTopicId(topicId: number, page: number = 1, limit: number = 20) {
  // Mock posts for a topic
  const mockPosts = [
    {
      id: 1,
      content: "Questo è un post di risposta",
      topicId: 1,
      userId: 2,
      isAnswer: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  return {
    posts: mockPosts.filter(p => p.topicId === topicId),
    totalCount: mockPosts.filter(p => p.topicId === topicId).length
  };
}

export async function getLatestForumTopics(limit: number) {
  return mockForumTopics.slice(0, limit);
}

export async function getLatestForumPosts(limit: number) {
  const mockPosts = [
    {
      id: 1,
      content: "Questo è un post di risposta",
      topicId: 1,
      userId: 2,
      isAnswer: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  return mockPosts.slice(0, limit);
}

export async function searchForumTopics(query: string, page: number = 1, limit: number = 20) {
  const lowerQuery = query.toLowerCase();
  const topics = mockForumTopics.filter(
    t => t.title.toLowerCase().includes(lowerQuery) || t.content.toLowerCase().includes(lowerQuery)
  );
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    topics: topics.slice(start, end),
    totalCount: topics.length
  };
}

export async function getForumReactionsByPostId(postId: number) {
  return [];
}

// User methods - versione semplificata che non richiede autenticazione
export async function getUser(id: number) {
  return undefined;
}

export async function getUserByUsername(username: string) {
  return undefined;
}

export async function createUser(user: any) {
  return { id: 1, ...user };
}

// Define all other methods as empty stubs
export const storage = {
  getUser,
  getUserByUsername,
  createUser,
  getTutorial,
  getTutorials,
  getTutorialsByType,
  createTutorial,
  getNews,
  getAllNews,
  getLatestNews,
  createNews,
  getAllForumCategories,
  getForumCategoryBySlug,
  getForumTopicsByCategoryId,
  getForumPostsByTopicId,
  getLatestForumTopics,
  getLatestForumPosts,
  searchForumTopics,
  getForumReactionsByPostId,
  // Placeholder methods
  getForm: async () => undefined,
  getFormsByUserId: async () => [],
  createForm: async (form: any) => ({ id: 1, ...form }),
  updateForm: async () => undefined,
  deleteForm: async () => true,
  updateTutorial: async () => undefined,
  getBlogPost: async () => undefined,
  getBlogPostBySlug: async () => undefined,
  getAllBlogPosts: async () => ({ posts: [], totalCount: 0 }),
  getBlogPostsByCategory: async () => ({ posts: [], totalCount: 0 }),
  searchBlogPosts: async () => ({ posts: [], totalCount: 0 }),
  getLatestBlogPosts: async () => [],
  getRelatedBlogPosts: async () => [],
  createBlogPost: async (post: any) => ({ id: 1, ...post }),
  updateBlogPost: async () => undefined,
  deleteBlogPost: async () => true,
  getForumCategory: async () => undefined,
  createForumCategory: async (category: any) => ({ id: 1, ...category }),
  updateForumCategory: async () => undefined,
  deleteForumCategory: async () => true,
  getForumTopic: async () => undefined,
  getForumTopicBySlug: async () => undefined,
  createForumTopic: async (topic: any) => ({ id: 1, ...topic }),
  updateForumTopic: async () => undefined,
  deleteForumTopic: async () => true,
  incrementForumTopicViewCount: async () => undefined,
  getForumPost: async () => undefined,
  createForumPost: async (post: any) => ({ id: 1, ...post }),
  updateForumPost: async () => undefined,
  deleteForumPost: async () => true,
  markForumPostAsAnswer: async () => undefined,
  getForumReaction: async () => undefined,
  getUserReactionToPost: async () => undefined,
  createForumReaction: async (reaction: any) => ({ id: 1, ...reaction }),
  deleteForumReaction: async () => true
};