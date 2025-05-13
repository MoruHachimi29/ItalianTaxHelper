/**
 * Dati mockati per tutorial e news
 * Semplificati e senza dipendenze dal database
 */

export const mockTutorials = [
  {
    id: 1,
    title: "Come compilare il modulo F24 Ordinario",
    description: "Guida completa alla compilazione del modulo F24 Ordinario dell'Agenzia delle Entrate",
    videoUrl: "",
    thumbnailUrl: "/images/tutorials/f24-ordinario-thumb.jpg",
    content: `
# Guida alla compilazione del modulo F24 Ordinario

Il modulo F24 Ordinario è il modello principale utilizzato per il pagamento di tasse, imposte e contributi. Ecco una guida passo-passo per compilarlo correttamente:

## Sezione "Contribuente"

1. **Codice fiscale**: Inserire il codice fiscale della persona o società che effettua il pagamento.
2. **Dati anagrafici**: Compilare con nome, cognome o denominazione sociale.
3. **Data di nascita e sesso**: Solo per le persone fisiche.
4. **Domicilio fiscale**: Indicare comune, provincia, via e numero civico.

## Sezione "Erario"

Utilizzata per pagamenti verso l'Erario (imposte sui redditi, IVA, ecc.):

1. **Codice tributo**: Codice numerico che identifica il tipo di imposta (es. 1040 per IRPEF).
2. **Anno di riferimento**: Anno d'imposta a cui si riferisce il pagamento.
3. **Importi a debito**: Somme da versare.
4. **Importi a credito**: Eventuali crediti da compensare.

## Sezione "INPS"

Per i contributi previdenziali:

1. **Codice sede**: Codice della sede INPS competente.
2. **Causale**: Codice che identifica il tipo di contributo.
3. **Matricola INPS/Codice INPS/Filiale azienda**: Codice identificativo presso l'INPS.
4. **Periodo di riferimento**: Periodo a cui si riferiscono i contributi (da MM/AAAA a MM/AAAA).

## Sezione "Regioni"

Per i tributi regionali:

1. **Codice regione**: Codice della regione destinataria.
2. **Codice tributo**: Identifica il tipo di tributo regionale.
3. **Anno di riferimento**: Anno d'imposta.

## Sezione "IMU e altri tributi locali"

Per IMU, TASI e altri tributi comunali:

1. **Codice ente**: Codice del comune destinatario.
2. **Ravvedimento/Immobili variati/Acc./Saldo**: Barrare la casella appropriata.
3. **Codice tributo**: Identifica il tipo di tributo locale.
4. **Anno di riferimento**: Anno d'imposta.

## Sezione "INAIL"

Per i contributi INAIL:

1. **Codice sede**: Codice della sede INAIL competente.
2. **Codice ditta**: Numero identificativo dell'azienda.
3. **C.C.**: Codice di controllo.
4. **Numero di riferimento**: Numero della PAT (Posizione Assicurativa Territoriale).

## Sezione "Totale"

Riportare i totali delle somme a debito e a credito e il saldo finale.

## Modalità di pagamento

Nella parte inferiore del modulo, indicare:

1. **Data di versamento**: Data in cui si effettua il pagamento.
2. **Firma**: Firma del contribuente.

È possibile utilizzare il modulo F24Editabile.it per compilare online il modulo e calcolarlo automaticamente, prima di stamparlo o inviarlo telematicamente.
    `,
    type: "tutorial",
    formType: "f24-ordinario",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-11-20")
  },
  {
    id: 2,
    title: "Come compilare il modulo F24 Semplificato",
    description: "Guida pratica al modulo F24 Semplificato con esempi pratici",
    videoUrl: "",
    thumbnailUrl: "/images/tutorials/f24-semplificato-thumb.jpg",
    content: `
# Guida alla compilazione del modulo F24 Semplificato

Il modulo F24 Semplificato è una versione più intuitiva del modello F24 Ordinario, progettato per semplificare il pagamento di tributi e contributi. Ecco come compilarlo:

## Sezione "Contribuente"

1. **Codice fiscale**: Inserire il codice fiscale del contribuente.
2. **Dati anagrafici**: Nome, cognome o denominazione sociale.
3. **Data di nascita e sesso**: Solo per persone fisiche.
4. **Residenza/Sede legale**: Comune, provincia, via e numero civico.

## Sezione "Motivo del pagamento"

Questa è la sezione principale del modello semplificato, che unifica le diverse sezioni del modello ordinario:

1. **Sezione**: Indicare la tipologia di tributo (es. "ER" per erario, "RG" per regioni, ecc.).
2. **Codice tributo**: Identifica il tipo specifico di imposta o contributo.
3. **Ente/Codice regione/Codice ente**: A seconda della sezione, indicare il codice dell'ente destinatario.
4. **Anno di riferimento**: Anno d'imposta a cui si riferisce il pagamento.
5. **Importi a debito versati**: Somme da versare.
6. **Importi a credito compensati**: Eventuali crediti da compensare.

È possibile inserire fino a due pagamenti per riga e compilare più righe in base alle necessità.

## Sezione "Totale"

Riportare i totali delle somme a debito e a credito e il saldo finale.

## Estremi del versamento

Nella parte inferiore del modulo, indicare:

1. **Data**: Data in cui si effettua il pagamento.
2. **Firma**: Firma del contribuente.

Il F24 Semplificato è particolarmente indicato per:
- Contribuenti non titolari di partita IVA
- Pagamenti semplici con poche voci
- Tributi locali come IMU e TASI

È possibile utilizzare il modulo F24Editabile.it per compilare online il modulo semplificato e calcolarlo automaticamente, prima di stamparlo o inviarlo telematicamente.
    `,
    type: "tutorial",
    formType: "f24-semplificato",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-11-20")
  },
  {
    id: 3,
    title: "Video guida: compilazione F24 Ordinario",
    description: "Video tutorial dettagliato sulla compilazione del modulo F24 Ordinario",
    videoUrl: "/videos/f24-ordinario-tutorial.mp4",
    thumbnailUrl: "/images/tutorials/f24-ordinario-video-thumb.jpg",
    content: "",
    type: "video",
    formType: "f24-ordinario",
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2023-10-20")
  },
  {
    id: 4,
    title: "Come compilare il modulo F24 Elementi Identificativi (ELIDE)",
    description: "Guida per la compilazione corretta del modulo F24 ELIDE",
    videoUrl: "",
    thumbnailUrl: "/images/tutorials/f24-elide-thumb.jpg",
    content: `
# Guida alla compilazione del modulo F24 Elementi Identificativi (ELIDE)

Il modulo F24 ELIDE (Elementi Identificativi) è utilizzato specificamente per il pagamento di:
- Imposte sui contratti di locazione e affitto
- Imposta di registro
- Tributi correlati a successioni e donazioni

Ecco come compilare correttamente questo modulo:

## Sezione "Contribuente"

Identica agli altri modelli F24:
1. **Codice fiscale**: Del soggetto che effettua il versamento.
2. **Dati anagrafici**: Nome, cognome o denominazione.
3. **Data di nascita e sesso**: Solo per persone fisiche.
4. **Domicilio fiscale**: Indirizzo completo.

## Sezione "Erario ed altro"

Questa è la sezione principale del modello ELIDE:

1. **Tipo**: Indicare "F" per identificare il modello come F24 ELIDE.
2. **Elementi identificativi**: Campo fondamentale che distingue questo modello. Qui vanno inseriti i dati che identificano l'oggetto del pagamento, come:
   - Codice del contratto di locazione
   - Codice della successione
   - Altri identificativi specifici richiesti
3. **Codice ufficio**: Codice dell'ufficio dell'Agenzia delle Entrate competente.
4. **Codice atto**: Se fornito dall'Agenzia delle Entrate.
5. **Codice tributo**: Identifica il tipo specifico di imposta.
6. **Anno di riferimento**: Anno d'imposta.
7. **Importi a debito versati**: Somme da versare.

## Sezione "Totale"

Riportare il totale delle somme a debito. Questo modello normalmente non prevede compensazioni.

## Informazioni per il versamento

Nella parte inferiore del modulo, indicare:
1. **Data**: Data in cui si effettua il pagamento.
2. **Firma**: Firma del contribuente.

Questo modello è particolarmente importante per:
- Registrazione contratti di locazione
- Adempimenti relativi a successioni
- Pagamento dell'imposta di registro

F24Editabile.it offre un servizio online per compilare il modulo F24 ELIDE con calcolo automatico degli importi e possibilità di salvare, stampare o condividere il documento compilato.
    `,
    type: "tutorial",
    formType: "f24-elide",
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2023-11-10")
  },
  {
    id: 5,
    title: "Guida al modulo F24 Accise",
    description: "Istruzioni dettagliate per la compilazione del modulo F24 Accise",
    videoUrl: "",
    thumbnailUrl: "/images/tutorials/f24-accise-thumb.jpg",
    content: `
# Guida alla compilazione del modulo F24 Accise

Il modulo F24 Accise è una versione specializzata del modello F24, dedicata al pagamento di:
- Accise sui prodotti energetici
- Imposte sui consumi energetici
- Diritti di licenza e altri tributi correlati

Ecco come compilare correttamente questo modulo specializzato:

## Sezione "Contribuente"

Identica agli altri modelli F24:
1. **Codice fiscale**: Inserire il codice fiscale del soggetto che effettua il versamento.
2. **Dati anagrafici**: Nome, cognome o denominazione sociale.
3. **Data di nascita e sesso**: Solo per persone fisiche.
4. **Domicilio fiscale**: Comune, provincia, via e numero civico.

## Sezione "Accise/Monopoli ed altri versamenti non ammessi in compensazione"

Questa è la sezione principale che caratterizza il modello:

1. **Ente**: Indicare l'ente destinatario del pagamento (es. "AD" per Agenzia delle Dogane).
2. **Provincia**: Sigla della provincia in cui si effettua il consumo o la vendita.
3. **Codice tributo**: Codice specifico che identifica il tipo di accisa o imposta.
4. **Codice identificativo**: Numero di licenza o altro codice identificativo rilasciato dall'Agenzia delle Dogane.
5. **Mese**: Mese di riferimento per il pagamento (in formato MM).
6. **Anno di riferimento**: Anno d'imposta a cui si riferisce il pagamento.
7. **Importi a debito versati**: Somme da versare.

## Altre Sezioni Standard

Il modello include anche le classiche sezioni dell'F24 ordinario:
- Sezione Erario
- Sezione INPS
- Sezione Regioni
- Sezione IMU e altri tributi locali
- Sezione INAIL

Queste sezioni si compilano solo se necessario, seguendo le stesse regole del modello ordinario.

## Sezione "Totale"

Riportare i totali complessivi delle somme a debito e il saldo finale.

## Estremi del versamento

Nella parte inferiore, indicare:
1. **Data**: Data in cui si effettua il pagamento.
2. **Firma**: Firma del contribuente.

Questo modello è utilizzato principalmente da:
- Aziende del settore energetico
- Gestori di stazioni di servizio
- Importatori e distributori di prodotti soggetti ad accisa

F24Editabile.it offre un servizio online per compilare il modulo F24 Accise con calcolo automatico degli importi e possibilità di salvare, stampare o condividere il documento compilato.
    `,
    type: "tutorial",
    formType: "f24-accise",
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2023-11-15")
  }
];

export const mockNews = [
  {
    id: 1,
    title: "Nuove scadenze fiscali 2024",
    slug: "nuove-scadenze-fiscali-2024",
    content: `
# Nuove scadenze fiscali per il 2024

L'Agenzia delle Entrate ha pubblicato il calendario aggiornato delle scadenze fiscali per l'anno 2024. Ecco le principali date da segnare:

## Dichiarazione dei redditi
- **30 settembre 2024**: Termine per la presentazione del modello Redditi PF 2024
- **30 novembre 2024**: Termine per la presentazione del modello Redditi SC e SP 2024

## Versamenti periodici
- **16 di ogni mese**: Versamento IVA mensile
- **16 maggio 2024**: Versamento IVA primo trimestre 2024
- **20 agosto 2024**: Versamento IVA secondo trimestre 2024
- **18 novembre 2024**: Versamento IVA terzo trimestre 2024

## IMU 2024
- **17 giugno 2024**: Acconto IMU 2024
- **16 dicembre 2024**: Saldo IMU 2024

## Adempimenti speciali
- **28 febbraio 2024**: Invio dati per dichiarazione precompilata
- **31 marzo 2024**: Presentazione Certificazione Unica 2024
- **16 giugno 2024**: Versamento saldo imposte 2023 e primo acconto 2024
- **30 novembre 2024**: Versamento secondo acconto imposte 2024

Ricordiamo che queste scadenze potrebbero subire variazioni in caso di proroghe o modifiche normative. Si consiglia di verificare sempre le date aggiornate sul sito dell'Agenzia delle Entrate.

F24Editabile.it mette a disposizione tutti i moduli necessari per effettuare i versamenti alle scadenze previste, con la possibilità di compilarli online, salvarli e stamparli gratuitamente.
    `,
    excerpt: "L'Agenzia delle Entrate ha pubblicato il calendario aggiornato delle scadenze fiscali per l'anno 2024. Ecco le principali date da ricordare.",
    author: "Staff F24Editabile",
    category: "Scadenze",
    tags: ["scadenze", "fisco", "2024", "IMU", "IVA"],
    coverImage: "/images/news/scadenze-2024.jpg",
    published: true,
    featured: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: 2,
    title: "Aggiornamento moduli F24 per il 2024",
    slug: "aggiornamento-moduli-f24-2024",
    content: `
# Aggiornamento dei moduli F24 per il 2024

L'Agenzia delle Entrate ha pubblicato i modelli F24 aggiornati per l'anno 2024. Le modifiche riguardano principalmente:

## Nuovi codici tributo
Sono stati introdotti nuovi codici tributo per il pagamento di:
- Nuove imposte sostitutive
- Crediti d'imposta introdotti dalla Legge di Bilancio 2024
- Tributi legati alla riforma fiscale

## Modifiche strutturali
Alcune sezioni del modello F24 hanno subito leggere modifiche per adeguarsi alle nuove normative:
- Nuova disposizione della sezione Erario
- Aggiunta di campi specifici per le compensazioni
- Aggiornamento dei codici degli enti destinatari

## Modalità di presentazione
Sono state aggiornate anche le regole per la presentazione telematica:
- Nuove categorie di contribuenti obbligati all'invio telematico
- Aggiornamento delle procedure per l'invio tramite intermediari
- Indicazioni per l'utilizzo dei servizi online dell'Agenzia delle Entrate

F24Editabile.it ha già aggiornato tutti i moduli disponibili sulla piattaforma, permettendo di compilare i nuovi modelli F24 2024 in modo semplice e intuitivo. Tutti i nuovi codici tributo sono già disponibili e integrati nel sistema di compilazione.

Ricordiamo che è importante utilizzare sempre le versioni più recenti dei modelli per evitare problemi di accettazione dei pagamenti.
    `,
    excerpt: "L'Agenzia delle Entrate ha pubblicato i modelli F24 aggiornati per l'anno 2024 con nuovi codici tributo e modifiche strutturali. F24Editabile ha già implementato tutti gli aggiornamenti.",
    author: "Team Tecnico F24Editabile",
    category: "Modulistica",
    tags: ["F24", "aggiornamenti", "2024", "codici tributo"],
    coverImage: "/images/news/moduli-2024.jpg",
    published: true,
    featured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: 3,
    title: "Guida al ravvedimento operoso F24",
    slug: "guida-ravvedimento-operoso-f24",
    content: `
# Guida completa al ravvedimento operoso tramite F24

Il ravvedimento operoso è uno strumento che consente ai contribuenti di regolarizzare omessi o insufficienti versamenti di tributi, beneficiando di sanzioni ridotte. Ecco come funziona e come utilizzare il modello F24 per questo scopo.

## Cos'è il ravvedimento operoso
Il ravvedimento operoso permette di sanare spontaneamente violazioni o omissioni tributarie, pagando:
- L'imposta dovuta
- Una sanzione ridotta (che varia in base al tempo trascorso dalla violazione)
- Gli interessi moratori calcolati al tasso legale

## Tipologie di ravvedimento
Esistono diverse tipologie di ravvedimento, che determinano la misura della riduzione della sanzione:

1. **Ravvedimento sprint**: Entro 14 giorni dalla scadenza (sanzione 0,1% per ogni giorno di ritardo)
2. **Ravvedimento breve**: Dal 15° al 30° giorno dalla scadenza (sanzione 1,5%)
3. **Ravvedimento medio**: Dal 31° al 90° giorno dalla scadenza (sanzione 1,67%)
4. **Ravvedimento lungo**: Dal 91° giorno fino a un anno dalla scadenza (sanzione 3,75%)
5. **Ravvedimento ultrannuale**: Oltre un anno dalla scadenza (sanzione 4,29%)
6. **Ravvedimento lunghissimo**: Oltre due anni dalla scadenza (sanzione 5%)

## Come compilare il modello F24 per il ravvedimento

1. **Tributo originario**: Inserire il codice tributo dell'imposta che si intende regolarizzare, l'anno di riferimento e l'importo dovuto.

2. **Interessi**: Utilizzare il codice tributo specifico per gli interessi (varia in base al tributo) e indicare l'importo degli interessi calcolati.

3. **Sanzioni**: Utilizzare il codice tributo specifico per le sanzioni (es. 8901 per le imposte dirette) e indicare l'importo della sanzione ridotta.

### Esempio pratico
Per regolarizzare un omesso versamento IRPEF di €1.000:
- Codice tributo 1040: €1.000 (imposta)
- Codice tributo 1989: importo degli interessi calcolati
- Codice tributo 8901: importo della sanzione ridotta

F24Editabile.it mette a disposizione uno strumento di calcolo automatico per ravvedimento operoso, che determina sanzioni e interessi in base alla data di scadenza originaria e alla data di pagamento, compilando automaticamente il modello F24 con tutti i codici tributo necessari.
    `,
    excerpt: "Il ravvedimento operoso consente di regolarizzare omessi o insufficienti versamenti di tributi con sanzioni ridotte. Ecco la guida completa alla compilazione del modello F24 per questa procedura.",
    author: "Team Fiscale F24Editabile",
    category: "Guide",
    tags: ["ravvedimento", "F24", "sanzioni", "interessi"],
    coverImage: "/images/news/ravvedimento.jpg",
    published: true,
    featured: false,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: 4,
    title: "Le novità fiscali della Legge di Bilancio 2024",
    slug: "novita-fiscali-legge-bilancio-2024",
    content: `
# Le novità fiscali della Legge di Bilancio 2024

La Legge di Bilancio 2024 ha introdotto numerose novità fiscali che impatteranno sui versamenti tramite F24. Ecco un riepilogo delle principali misure.

## Riforma delle aliquote IRPEF
È stata modificata la struttura delle aliquote IRPEF, passando da 4 a 3 scaglioni:
- Fino a €28.000: aliquota del 23%
- Da €28.001 a €50.000: aliquota del 35%
- Oltre €50.000: aliquota del 43%

## Modifiche alle detrazioni fiscali
- Nuovi limiti di reddito per le detrazioni
- Rimodulazione delle spese detraibili per redditi superiori a €75.000
- Nuove regole per le detrazioni per ristrutturazioni e risparmio energetico

## Novità per le partite IVA
- Estensione del regime forfettario fino a €85.000
- Nuova flat tax per ricavi incrementali
- Nuova tassazione agevolata sugli utili reinvestiti

## Proroghe e nuovi bonus
- Superbonus ridotto al 70% per il 2024
- Proroga bonus mobili con tetto di €5.000
- Nuovo bonus ristrutturazione facciate al 60%

## Imposte immobiliari
- Revisione delle rendite catastali per alcune categorie
- Nuove regole per l'IMU su immobili occupati abusivamente
- Modifiche alla cedolare secca sulle locazioni brevi

## Nuovi codici tributo
Per gestire queste novità, l'Agenzia delle Entrate ha introdotto numerosi nuovi codici tributo, tra cui:
- Codici per le nuove imposte sostitutive
- Codici per i nuovi crediti d'imposta
- Codici specifici per le agevolazioni prorogate

F24Editabile.it ha già aggiornato il sistema con tutti i nuovi codici tributo necessari per effettuare i versamenti relativi alle novità fiscali 2024. Il nostro calcolatore online è stato aggiornato con le nuove aliquote e le modifiche normative per garantire calcoli corretti e conformi alla nuova legislazione.
    `,
    excerpt: "La Legge di Bilancio 2024 ha introdotto significative novità fiscali: nuove aliquote IRPEF, modifiche alle detrazioni, agevolazioni per le partite IVA e molto altro. Ecco cosa cambia per i tuoi versamenti con F24.",
    author: "Redazione F24Editabile",
    category: "Normativa",
    tags: ["legge di bilancio", "2024", "IRPEF", "detrazioni", "bonus"],
    coverImage: "/images/news/legge-bilancio.jpg",
    published: true,
    featured: false,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25")
  },
  {
    id: 5,
    title: "F24 per il pagamento IMU 2024: cosa sapere",
    slug: "f24-pagamento-imu-2024",
    content: `
# F24 per il pagamento IMU 2024: cosa c'è da sapere

L'IMU (Imposta Municipale Propria) è una delle principali imposte sugli immobili in Italia, da versare attraverso il modello F24. Ecco tutte le informazioni utili per il 2024.

## Scadenze IMU 2024
- **Acconto**: 17 giugno 2024 (il 16 cade di domenica)
- **Saldo**: 16 dicembre 2024

## Come compilare il modello F24 per l'IMU

### Sezione "IMU e altri tributi locali"
1. **Codice ente/codice comune**: Il codice catastale del comune in cui si trova l'immobile (tabella disponibile sul sito dell'Agenzia delle Entrate)
2. **Ravvedimento**: Barrare la casella solo in caso di ravvedimento operoso
3. **Immobili variati**: Barrare se la situazione immobiliare è cambiata rispetto all'anno precedente
4. **Acc./Saldo**: Barrare "Acc." per l'acconto di giugno, "Saldo" per il saldo di dicembre
5. **Codice tributo**: 
   - 3912: IMU abitazione principale (solo categorie di lusso A/1, A/8, A/9)
   - 3914: IMU terreni
   - 3916: IMU aree fabbricabili
   - 3918: IMU altri fabbricati
   - 3925: IMU immobili ad uso produttivo (categoria D) - quota Stato
   - 3930: IMU immobili ad uso produttivo (categoria D) - quota Comune
6. **Anno di riferimento**: 2024
7. **Importi a debito versati**: L'importo da pagare

## Calcolo dell'IMU 2024
Il calcolo si basa su:
- Rendita catastale rivalutata del 5%
- Moltiplicatore specifico per categoria catastale
- Aliquota stabilita dal Comune

### Formula di calcolo
Valore imponibile = (Rendita catastale × 1,05) × Moltiplicatore
IMU dovuta = Valore imponibile × Aliquota comunale

### Moltiplicatori
- 160 per le categorie A (tranne A/10), C/2, C/6, C/7
- 140 per le categorie B, C/3, C/4, C/5
- 80 per le categorie A/10 e D/5
- 65 per gli immobili di categoria D (esclusi D/5)
- 55 per la categoria C/1

## Esenzioni IMU 2024
Sono esenti:
- Abitazioni principali (tranne categorie di lusso A/1, A/8, A/9)
- Immobili di proprietà di anziani o disabili ricoverati permanentemente
- Immobili inagibili o inabitabili
- Alcune categorie specifiche previste da disposizioni locali

F24Editabile.it mette a disposizione un calcolatore IMU online che determina automaticamente l'importo da versare in base ai dati catastali e al comune di ubicazione dell'immobile, compilando il modello F24 con i corretti codici tributo e importi.
    `,
    excerpt: "L'IMU è una delle principali imposte sugli immobili, da versare con F24 in due rate: acconto entro il 17 giugno e saldo entro il 16 dicembre 2024. Ecco come compilare correttamente il modello.",
    author: "Ufficio Tecnico F24Editabile",
    category: "Tributi Locali",
    tags: ["IMU", "2024", "F24", "tributi locali"],
    coverImage: "/images/news/imu-2024.jpg",
    published: true,
    featured: false,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-01-30")
  }
];