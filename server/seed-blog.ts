import { db } from "./db";
import { blogPosts } from "@shared/schema";

export default async function seedBlogPosts() {
  console.log("Seeding blog posts...");

  // Check if we already have blog posts in the database
  const existingPosts = await db.select().from(blogPosts).limit(1);
  if (existingPosts.length > 0) {
    console.log("Blog posts already seeded. Skipping.");
    return;
  }

  // Sample blog post data
  const samplePosts = [
    {
      title: "Novità fiscali 2025: le principali modifiche della Legge di Bilancio",
      slug: "novita-fiscali-2025",
      summary: "Un'analisi dettagliata delle principali novità fiscali introdotte dalla Legge di Bilancio 2025, con focus sulle nuove aliquote IRPEF e modifiche alle detrazioni.",
      content: `
        <h2>Legge di Bilancio 2025: tutte le novità fiscali</h2>
        <p>La nuova Legge di Bilancio per il 2025 introduce modifiche significative al sistema fiscale italiano. In questo articolo analizziamo le principali novità che interesseranno contribuenti, famiglie e imprese.</p>
        
        <h3>Riforma delle aliquote IRPEF</h3>
        <p>Una delle modifiche più rilevanti riguarda le aliquote IRPEF, che sono state ulteriormente semplificate. Dal 2025, il sistema si articolerà su tre aliquote principali:</p>
        <ul>
          <li>23% per redditi fino a 28.000 euro</li>
          <li>35% per redditi tra 28.000 e 50.000 euro</li>
          <li>43% per redditi superiori a 50.000 euro</li>
        </ul>
        <p>Questa riforma mira a ridurre il carico fiscale sui redditi medio-bassi e semplificare il sistema tributario.</p>
        
        <h3>Detrazioni fiscali</h3>
        <p>Confermata la maggior parte delle detrazioni, con alcune modifiche importanti per quanto riguarda le spese sanitarie e quelle per ristrutturazioni edilizie. In particolare:</p>
        <ol>
          <li>La detrazione per spese sanitarie rimane al 19%, ma con un abbassamento della franchigia da 129,11 euro a 100 euro.</li>
          <li>Il Superbonus scende al 65% per il 2025, con limitazioni più stringenti per l'accesso all'agevolazione.</li>
          <li>Introdotto un nuovo sistema di detrazioni per le famiglie con figli a carico, con maggiorazioni per i nuclei numerosi.</li>
        </ol>
        
        <h3>Flat tax e regime forfettario</h3>
        <p>Il regime forfettario per le partite IVA viene confermato con la soglia di 85.000 euro, ma con alcune modifiche ai coefficienti di redditività per determinate categorie professionali.</p>
        
        <h3>Scadenze fiscali 2025</h3>
        <p>È stato anche rivisto il calendario fiscale, con alcune importanti novità:</p>
        <ul>
          <li>30 aprile 2025: presentazione modello 730 precompilato</li>
          <li>30 giugno 2025: versamento saldo e primo acconto IRPEF</li>
          <li>30 settembre 2025: secondo acconto per i soggetti ISA</li>
          <li>30 novembre 2025: secondo acconto ordinario IRPEF</li>
        </ul>
        
        <h2>Conclusioni</h2>
        <p>Le novità fiscali introdotte dalla Legge di Bilancio 2025 rappresentano un passo verso la semplificazione del sistema tributario italiano. È consigliabile, tuttavia, consultare un commercialista o un esperto fiscale per valutare come queste modifiche impatteranno sulla propria situazione personale o aziendale.</p>
      `,
      imageUrl: "/assets/F.png",
      author: "Dott. Marco Rossi",
      category: "fisco",
      tags: ["fisco", "irpef", "legge di bilancio", "tasse", "2025"],
      publishDate: new Date("2025-01-10T09:00:00Z"),
      isPublished: true,
      metaTitle: "Novità Fiscali 2025: Analisi della Legge di Bilancio | F24Editabile",
      metaDescription: "Scopri tutte le novità fiscali della Legge di Bilancio 2025: nuove aliquote IRPEF, detrazioni, bonus e scadenze fiscali per contribuenti e imprese.",
      metaKeywords: "novità fiscali 2025, legge bilancio, irpef, detrazioni, scadenze fiscali, tasse"
    },
    {
      title: "Guida completa alla compilazione del modello F24: consigli e suggerimenti",
      slug: "guida-compilazione-modello-f24",
      summary: "Una guida pratica alla compilazione del modello F24, con suggerimenti per evitare errori comuni e ottimizzare le procedure di pagamento.",
      content: `
        <h2>Come compilare correttamente il modello F24</h2>
        <p>Il modello F24 è uno dei documenti fiscali più utilizzati in Italia, necessario per il pagamento di imposte, tasse e contributi. In questa guida, vi spiegheremo passo dopo passo come compilarlo correttamente, evitando errori che potrebbero causare problemi con l'Agenzia delle Entrate.</p>
        
        <h3>Sezioni del modello F24</h3>
        <p>Il modello F24 è diviso in diverse sezioni:</p>
        <ul>
          <li><strong>Sezione "Contribuente"</strong>: dove inserire i dati anagrafici e il codice fiscale di chi effettua il pagamento.</li>
          <li><strong>Sezione "Erario"</strong>: utilizzata per il pagamento di imposte come IRPEF, IVA, ritenute e altre tasse statali.</li>
          <li><strong>Sezione "INPS"</strong>: per il versamento dei contributi previdenziali.</li>
          <li><strong>Sezione "Regioni"</strong>: per imposte regionali come IRAP e addizionali regionali all'IRPEF.</li>
          <li><strong>Sezione "IMU e altri tributi locali"</strong>: per il pagamento di tributi comunali come IMU e TASI.</li>
          <li><strong>Sezione "Altri enti previdenziali"</strong>: per contributi a casse professionali diverse dall'INPS.</li>
        </ul>
        
        <h3>Compilazione step by step</h3>
        <ol>
          <li><strong>Dati anagrafici</strong>: Iniziate inserendo il vostro codice fiscale e i vostri dati anagrafici nella sezione "Contribuente".</li>
          <li><strong>Codici tributo</strong>: Ogni imposta o contributo ha un codice tributo specifico che va inserito nella sezione appropriata.</li>
          <li><strong>Periodo di riferimento</strong>: Indicate il periodo d'imposta a cui si riferisce il pagamento, utilizzando il formato MM/AAAA per i versamenti mensili o il solo anno per quelli annuali.</li>
          <li><strong>Importi</strong>: Inserite gli importi da versare, facendo attenzione a utilizzare il punto come separatore dei decimali.</li>
          <li><strong>Saldo finale</strong>: Verificate che il saldo finale corrisponda alla somma di tutti gli importi inseriti.</li>
        </ol>
        
        <h3>Errori comuni da evitare</h3>
        <p>Ecco alcuni errori frequenti nella compilazione del modello F24:</p>
        <ul>
          <li>Utilizzare codici tributo errati o obsoleti</li>
          <li>Indicare periodi di riferimento non corretti</li>
          <li>Dimenticare di firmare il modello (in caso di presentazione cartacea)</li>
          <li>Errori nel calcolo del saldo finale</li>
          <li>Confondere le varie sezioni del modello</li>
        </ul>
        
        <h3>Compensazione dei crediti</h3>
        <p>Il modello F24 permette anche di compensare eventuali crediti d'imposta con i debiti. Per farlo, inserite l'importo a credito nella colonna "Importi a credito" e assicuratevi che il saldo finale sia corretto.</p>
        
        <h3>Modalità di presentazione</h3>
        <p>A seconda della vostra situazione fiscale, potete presentare il modello F24:</p>
        <ul>
          <li>Tramite i servizi telematici dell'Agenzia delle Entrate (F24 web, F24 online)</li>
          <li>Tramite home banking</li>
          <li>Presso gli sportelli bancari o postali (con alcune limitazioni)</li>
        </ul>
        
        <h2>Conclusioni</h2>
        <p>La corretta compilazione del modello F24 è fondamentale per evitare sanzioni e problemi con il fisco. In caso di dubbi, è sempre consigliabile consultare un commercialista o un esperto fiscale. Ricordate inoltre che F24Editabile.it offre strumenti online per compilare facilmente e correttamente questi moduli.</p>
      `,
      imageUrl: "/assets/Modello_F24.png",
      author: "Dott.ssa Laura Bianchi",
      category: "fisco",
      tags: ["f24", "modello", "compilazione", "tasse", "pagamenti"],
      publishDate: new Date("2025-01-05T10:30:00Z"),
      isPublished: true,
      metaTitle: "Guida Completa alla Compilazione del Modello F24 | F24Editabile",
      metaDescription: "Impara a compilare correttamente il modello F24 con la nostra guida dettagliata: sezioni, codici tributo, errori da evitare e modalità di presentazione.",
      metaKeywords: "modello F24, compilazione F24, guida F24, codici tributo, pagamento tasse, compensazione crediti"
    },
    {
      title: "Mercati finanziari: previsioni e opportunità di investimento per il 2025",
      slug: "mercati-finanziari-previsioni-2025",
      summary: "Analisi delle tendenze dei mercati finanziari per il 2025, con focus sulle principali asset class e suggerimenti per diversificare gli investimenti.",
      content: `
        <h2>Panoramica dei mercati finanziari nel 2025</h2>
        <p>Il 2025 si presenta come un anno di sfide e opportunità per gli investitori. Dopo anni di volatilità significativa, i mercati finanziari globali stanno entrando in una nuova fase caratterizzata da una normalizzazione dei tassi d'interesse e da una crescita economica più stabile.</p>
        
        <h3>Il contesto macroeconomico</h3>
        <p>L'economia globale sta mostrando segnali di resilienza, con una crescita stimata intorno al 3,2% per il 2025. In particolare:</p>
        <ul>
          <li>L'inflazione nei paesi sviluppati si è stabilizzata intorno al 2-2,5%, permettendo alle banche centrali di adottare politiche monetarie più equilibrate.</li>
          <li>Il mercato del lavoro rimane robusto, con tassi di disoccupazione storicamente bassi in molte economie avanzate.</li>
          <li>La transizione energetica continua a guidare investimenti significativi in tecnologie verdi e infrastrutture sostenibili.</li>
        </ul>
        
        <h3>Mercati azionari</h3>
        <p>Per quanto riguarda i mercati azionari, gli analisti prevedono:</p>
        <ol>
          <li><strong>Mercati europei</strong>: Dopo anni di sottoperformance rispetto agli Stati Uniti, le azioni europee potrebbero offrire opportunità interessanti, soprattutto nei settori industriali e finanziari.</li>
          <li><strong>Mercati emergenti</strong>: Paesi come India e alcune economie del Sud-Est asiatico presentano prospettive di crescita attraenti, sostenute da dinamiche demografiche favorevoli e dalla crescita della classe media.</li>
          <li><strong>Settore tecnologico</strong>: Nonostante le valutazioni elevate, il settore tech continua a offrire opportunità, specialmente nelle aree dell'intelligenza artificiale, cybersecurity e cloud computing.</li>
        </ol>
        
        <h3>Mercati obbligazionari</h3>
        <p>Sul fronte obbligazionario, la situazione appare più complessa:</p>
        <ul>
          <li>I titoli di Stato offrono rendimenti più attraenti rispetto agli anni passati, con i BTP decennali che si attestano intorno al 3,5-4%.</li>
          <li>Il mercato delle obbligazioni corporate presenta opportunità selettive, soprattutto nel segmento investment grade.</li>
          <li>Il debito dei mercati emergenti potrebbe offrire premi interessanti, ma con rischi più elevati legati alla volatilità valutaria e alla stabilità politica.</li>
        </ul>
        
        <h3>Materie prime e alternative</h3>
        <p>Nel settore delle materie prime e degli investimenti alternativi:</p>
        <ul>
          <li>L'oro mantiene il suo ruolo di bene rifugio, particolarmente rilevante in un contesto geopolitico incerto.</li>
          <li>Le materie prime legate alla transizione energetica (litio, rame, nichel) potrebbero beneficiare della crescente domanda per veicoli elettrici e energie rinnovabili.</li>
          <li>Gli investimenti in private equity e real estate continuano a essere considerati come diversificatori efficaci in un portafoglio bilanciato.</li>
        </ul>
        
        <h3>Suggerimenti per gli investitori italiani</h3>
        <p>Per gli investitori italiani, ecco alcuni spunti da considerare:</p>
        <ol>
          <li>Diversificare geograficamente, includendo esposizione ai mercati internazionali oltre all'Europa.</li>
          <li>Considerare una allocazione bilanciata tra azioni e obbligazioni, in base al proprio profilo di rischio e orizzonte temporale.</li>
          <li>Non sottovalutare l'impatto dell'inflazione sul potere d'acquisto: includere asset con potenziale di protezione dall'inflazione.</li>
          <li>Valutare le opportunità fiscali offerte da strumenti come i PIR (Piani Individuali di Risparmio) per investimenti focalizzati sul mercato italiano.</li>
        </ol>
        
        <h2>Conclusioni</h2>
        <p>Il 2025 si configura come un anno di transizione per i mercati finanziari, con opportunità interessanti ma anche rischi da monitorare attentamente. La diversificazione e un approccio disciplinato agli investimenti rimangono le strategie più prudenti in un contesto di mercato che, seppur complessivamente positivo, non è privo di incognite.</p>
      `,
      imageUrl: "/assets/1000109272.jpg",
      author: "Dott. Paolo Verdi",
      category: "finanza",
      tags: ["investimenti", "mercati", "finanza", "borse", "2025"],
      publishDate: new Date("2025-01-08T08:45:00Z"),
      isPublished: true,
      metaTitle: "Mercati Finanziari 2025: Previsioni e Opportunità di Investimento | F24Editabile",
      metaDescription: "Scopri le previsioni sui mercati finanziari per il 2025: analisi delle tendenze su azioni, obbligazioni e materie prime, con consigli per gli investitori italiani.",
      metaKeywords: "mercati finanziari 2025, investimenti, previsioni economiche, azioni, obbligazioni, materie prime, btp"
    },
    {
      title: "Smart working e nuove normative: cosa cambia nel 2025 per lavoratori e aziende",
      slug: "smart-working-normative-2025",
      summary: "Le novità legislative in materia di lavoro agile e le implicazioni fiscali e contributive per dipendenti e datori di lavoro nel nuovo anno.",
      content: `
        <h2>Smart working in Italia: la situazione nel 2025</h2>
        <p>Lo smart working, o lavoro agile, è ormai una realtà consolidata nel panorama lavorativo italiano. Dopo la spinta forzata durante la pandemia, questa modalità di lavoro ha continuato ad evolversi, portando a nuove normative e regolamentazioni che sono entrate in vigore nel 2025.</p>
        
        <h3>Quadro normativo aggiornato</h3>
        <p>La legislazione italiana in materia di smart working ha subito importanti modifiche con l'entrata in vigore della "Legge per il Lavoro Agile 2025". Ecco i principali cambiamenti:</p>
        <ul>
          <li><strong>Diritto alla disconnessione</strong>: È stato formalizzato il diritto alla disconnessione, che impone alle aziende di garantire periodi di riposo in cui il lavoratore non può essere contattato.</li>
          <li><strong>Accordi individuali</strong>: Gli accordi di smart working devono essere rimodulati secondo le nuove linee guida, con una definizione più chiara degli obiettivi e dei metodi di valutazione della performance.</li>
          <li><strong>Sicurezza sul lavoro</strong>: Ampliate le responsabilità dei datori di lavoro per quanto riguarda la sicurezza delle postazioni domestiche, con nuovi requisiti minimi da garantire.</li>
          <li><strong>Contributi per l'adeguamento degli spazi</strong>: Introdotte agevolazioni fiscali per l'acquisto di arredi e attrezzature ergonomiche destinate allo smart working.</li>
        </ul>
        
        <h3>Aspetti fiscali e contributivi</h3>
        <p>Dal punto di vista fiscale, il 2025 ha portato diverse novità per i lavoratori in modalità agile:</p>
        <ol>
          <li><strong>Indennità di smart working</strong>: È stata formalizzata la possibilità per le aziende di erogare un'indennità mensile esentasse fino a 200 euro per coprire i costi aggiuntivi sostenuti dal lavoratore (elettricità, riscaldamento, connessione internet).</li>
          <li><strong>Detrazioni per home office</strong>: I lavoratori possono detrarre nella dichiarazione dei redditi fino al 19% delle spese sostenute per allestire uno spazio di lavoro adeguato, con un tetto massimo di 1.500 euro annui.</li>
          <li><strong>Benefit aziendali</strong>: Ampliato il regime di non imponibilità per i benefit dedicati ai lavoratori agili, come abbonamenti a servizi di connettività o piattaforme di co-working.</li>
        </ol>
        
        <h3>Impatti sulle aziende</h3>
        <p>Per le imprese, la nuova normativa comporta opportunità ma anche adempimenti:</p>
        <ul>
          <li>Obbligo di revisione degli accordi esistenti entro giugno 2025</li>
          <li>Necessità di implementare strumenti di monitoraggio della produttività rispettosi della privacy</li>
          <li>Formazione obbligatoria sui temi della sicurezza informatica e della protezione dei dati</li>
          <li>Incentivi fiscali per l'adozione di piattaforme di collaborazione e gestione del lavoro remoto</li>
        </ul>
        
        <h3>Implicazioni pratiche per i lavoratori</h3>
        <p>I lavoratori in smart working dovranno tener conto di diversi aspetti pratici:</p>
        <ul>
          <li><strong>Comunicazione e reportistica</strong>: Seguire le nuove linee guida per la rendicontazione delle attività svolte da remoto</li>
          <li><strong>Orario di lavoro</strong>: Rispettare le fasce di reperibilità concordate, assicurando il diritto alla disconnessione</li>
          <li><strong>Documentazione fiscale</strong>: Conservare la documentazione relativa alle spese sostenute per l'home office ai fini delle detrazioni</li>
          <li><strong>Formazione continua</strong>: Partecipare ai percorsi formativi obbligatori sulla sicurezza e la protezione dei dati</li>
        </ul>
        
        <h2>Conclusioni</h2>
        <p>Il 2025 segna un punto di svolta per la regolamentazione dello smart working in Italia, con un approccio più strutturato e attento agli aspetti fiscali, contributivi e di benessere dei lavoratori. Le nuove normative mirano a trovare un equilibrio tra le esigenze di flessibilità delle aziende e la tutela dei diritti dei lavoratori, in un contesto lavorativo che continua a evolversi rapidamente.</p>
      `,
      imageUrl: "/assets/ef7985b0-789e-49da-a51e-6c2b4ba1cc31 (1).png",
      author: "Avv. Giulia Neri",
      category: "lavoro",
      tags: ["smart working", "lavoro agile", "normative", "fisco", "2025"],
      publishDate: new Date("2025-01-02T14:15:00Z"),
      isPublished: true,
      metaTitle: "Smart Working 2025: Nuove Normative per Lavoratori e Aziende | F24Editabile",
      metaDescription: "Scopri le novità legislative sullo smart working nel 2025: diritto alla disconnessione, aspetti fiscali, contributi e implicazioni per dipendenti e aziende.",
      metaKeywords: "smart working 2025, lavoro agile, normative, diritto disconnessione, indennità smart working, fisco, detrazioni home office"
    },
    {
      title: "Criptovalute e fisco italiano: guida alla dichiarazione e tassazione nel 2025",
      slug: "criptovalute-fisco-tassazione-2025",
      summary: "Come dichiarare correttamente le criptovalute nel 2025: normative aggiornate, obblighi fiscali e strategie per ottimizzare la tassazione degli investimenti digitali.",
      content: `
        <h2>La situazione normativa delle criptovalute in Italia nel 2025</h2>
        <p>Il quadro normativo italiano in materia di criptovalute ha subito una significativa evoluzione negli ultimi anni, culminando con le disposizioni introdotte nella Legge di Bilancio 2025 e nel successivo Decreto Cripto-Attività. Vediamo nel dettaglio cosa prevedono le nuove norme e quali sono gli obblighi dei possessori di valute digitali.</p>
        
        <h3>Inquadramento fiscale delle criptovalute</h3>
        <p>Le criptovalute sono ora ufficialmente classificate come "cripto-attività" e sono sottoposte a un regime fiscale specifico:</p>
        <ul>
          <li><strong>Natura giuridica</strong>: Definite come rappresentazioni digitali di valore o di diritti che possono essere trasferite e archiviate elettronicamente mediante tecnologie a registro distribuito.</li>
          <li><strong>Tassazione delle plusvalenze</strong>: Si applica un'imposta sostitutiva del 26% sulle plusvalenze realizzate, ma solo se il controvalore complessivo detenuto supera i 2.000 euro per almeno 7 giorni lavorativi consecutivi nel periodo d'imposta.</li>
          <li><strong>Esenzione per i piccoli investitori</strong>: Chi detiene criptovalute sotto la soglia dei 2.000 euro è esente dalla tassazione delle plusvalenze.</li>
        </ul>
        
        <h3>Obblighi dichiarativi nel quadro RW</h3>
        <p>Una delle novità più importanti riguarda l'obbligo di dichiarazione nel quadro RW della dichiarazione dei redditi:</p>
        <ol>
          <li><strong>Monitoraggio fiscale</strong>: Tutte le cripto-attività devono essere indicate nel quadro RW se il loro valore complessivo supera i 15.000 euro in qualsiasi momento dell'anno.</li>
          <li><strong>Valutazione</strong>: Il valore da dichiarare è quello di mercato al 31 dicembre dell'anno di riferimento, rilevato sui principali exchange o, in mancanza, secondo criteri definiti dall'Agenzia delle Entrate.</li>
          <li><strong>Imposta sul valore delle cripto-attività (IVCA)</strong>: Si applica un'imposta patrimoniale dello 0,2% sul valore delle cripto-attività detenute, da liquidare direttamente in dichiarazione dei redditi.</li>
        </ol>
        
        <h3>Mining, staking e lending: il trattamento fiscale</h3>
        <p>Per le attività di mining (creazione di nuove criptovalute), staking (validazione delle transazioni con blocco di token) e lending (prestito di criptovalute), il trattamento fiscale è il seguente:</p>
        <ul>
          <li><strong>Mining</strong>: I proventi sono considerati redditi diversi se l'attività è occasionale, mentre sono redditi d'impresa se l'attività è abituale e organizzata.</li>
          <li><strong>Staking e lending</strong>: I rendimenti sono assimilati a redditi di capitale e tassati con aliquota del 26%, indipendentemente dalla soglia di esenzione.</li>
          <li><strong>NFT (Non-Fungible Token)</strong>: Hanno un trattamento specifico a seconda della loro natura: se rappresentano opere d'arte digitali, seguono la normativa delle opere d'arte; se rappresentano diritti o utilità, seguono le regole delle cripto-attività.</li>
        </ul>
        
        <h3>Compilazione della dichiarazione dei redditi</h3>
        <p>Ecco come procedere correttamente nella dichiarazione dei redditi 2025:</p>
        <ol>
          <li><strong>Quadro RT</strong>: Qui vanno indicate le plusvalenze realizzate durante l'anno attraverso operazioni di trading, conversione in euro o acquisto di beni/servizi.</li>
          <li><strong>Quadro RW</strong>: In questa sezione si dichiara il possesso delle cripto-attività al 31 dicembre, indicando:
            <ul>
              <li>Il codice identificativo della cripto-attività</li>
              <li>La quantità detenuta</li>
              <li>Il controvalore in euro al 31/12</li>
              <li>La piattaforma di detenzione (exchange o wallet)</li>
            </ul>
          </li>
          <li><strong>Quadro LM</strong>: Per chi svolge attività abituale di mining o trading con partita IVA in regime forfettario.</li>
        </ol>
        
        <h3>Strategie di ottimizzazione fiscale</h3>
        <p>Alcuni suggerimenti per ottimizzare la gestione fiscale delle criptovalute:</p>
        <ul>
          <li><strong>Compensazione delle minusvalenze</strong>: Le perdite su cripto-attività possono essere compensate con plusvalenze della stessa natura entro il quarto periodo d'imposta successivo.</li>
          <li><strong>Regime dichiarativo vs. amministrato</strong>: Alcune piattaforme offrono il regime amministrato, dove l'imposta è calcolata e trattenuta direttamente dall'intermediario.</li>
          <li><strong>Donazioni e successioni</strong>: Le cripto-attività trasferite per donazione o successione sono soggette alle relative imposte se il valore supera le franchigie di legge.</li>
        </ul>
        
        <h2>Conclusioni</h2>
        <p>La normativa fiscale italiana sulle criptovalute ha fatto significativi passi avanti in termini di chiarezza e definizione degli obblighi. È fondamentale mantenere una documentazione accurata di tutte le transazioni effettuate e, in caso di dubbi, rivolgersi a un consulente fiscale specializzato in asset digitali per evitare sanzioni o complicazioni in sede di accertamento.</p>
      `,
      imageUrl: "/assets/Modello_F24_Elementi_identificativi.png",
      author: "Dott. Alessandro Ferrara",
      category: "tecnologia",
      tags: ["criptovalute", "bitcoin", "fisco", "tasse", "dichiarazione redditi", "2025"],
      publishDate: new Date("2025-01-09T12:00:00Z"),
      isPublished: true,
      metaTitle: "Criptovalute e Fisco nel 2025: Guida alla Dichiarazione e Tassazione | F24Editabile",
      metaDescription: "Come dichiarare e tassare correttamente le criptovalute nel 2025: obblighi fiscali, quadro RW, plusvalenze e strategie di ottimizzazione per gli investitori digitali.",
      metaKeywords: "criptovalute fisco 2025, bitcoin tassazione, quadro RW cripto, dichiarazione criptovalute, plusvalenze bitcoin, mining tassazione, staking"
    }
  ];

  // Insert sample blog posts into the database
  try {
    await db.insert(blogPosts).values(samplePosts);
    console.log(`Successfully seeded ${samplePosts.length} blog posts.`);
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    throw error;
  }
}

// La funzione è già stata esportata come default all'inizio del file