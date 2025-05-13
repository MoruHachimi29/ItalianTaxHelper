/**
 * Script per la creazione di una versione completamente statica del sito
 * Questo approccio rimuove completamente la dipendenza dal server Express
 * e produce una versione che può essere deployata su qualsiasi hosting statico
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ottieni il percorso corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory target
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(DIST_DIR, 'data');

console.log('Inizia il processo di creazione della versione statica');

// Funzione per eseguire comandi in sequenza
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Esecuzione: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Errore: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Funzione principale
async function createStaticVersion() {
  try {
    // 1. Pulizia directory
    console.log('Pulizia directory di build...');
    if (fs.existsSync(DIST_DIR)) {
      fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR, { recursive: true });
    fs.mkdirSync(DATA_DIR, { recursive: true });

    // 2. Build del frontend con Vite
    console.log('Build del frontend con Vite...');
    await runCommand('npx vite build');

    // 3. Crea i file JSON statici per le API
    console.log('Creazione dei file JSON statici per le API...');
    
    // Importa i dati dalle API
    const { bonusCategories, bonusList } = await import('./src/api/bonus.js');
    const { currentDebtData, historicalDebtData, comparisonData } = await import('./src/api/publicDebt.js');
    const { mockTutorials, mockNews } = await import('./src/api/mockData.js');

    // Crea i file JSON
    const apiEndpoints = [
      { path: 'bonus-categories.json', data: bonusCategories },
      { path: 'bonus-list.json', data: bonusList },
      { path: 'bonus-isee-ranges.json', data: [
        { min: 0, max: 10000, label: "0-10.000€" },
        { min: 10001, max: 20000, label: "10.001-20.000€" },
        { min: 20001, max: 30000, label: "20.001-30.000€" },
        { min: 30001, max: 40000, label: "30.001-40.000€" },
        { min: 40001, max: null, label: "Oltre 40.000€" }
      ]},
      { path: 'bonus-new.json', data: bonusList.filter(bonus => bonus.isNew) },
      { path: 'bonus-expiring.json', data: bonusList.filter(bonus => bonus.isExpiring) },
      { path: 'public-debt-current.json', data: currentDebtData },
      { path: 'public-debt-historical.json', data: historicalDebtData },
      { path: 'public-debt-comparison.json', data: comparisonData },
      { path: 'tutorials.json', data: mockTutorials },
      { path: 'news.json', data: mockNews },
    ];

    // Scrivi i file JSON
    for (const endpoint of apiEndpoints) {
      const filePath = path.join(DATA_DIR, endpoint.path);
      fs.writeFileSync(filePath, JSON.stringify(endpoint.data, null, 2));
      console.log(`Creato file ${endpoint.path}`);
    }

    // 4. Crea un file dati per ogni bonus
    console.log('Creazione dei file dati individuali per i bonus...');
    if (!fs.existsSync(path.join(DATA_DIR, 'bonus'))) {
      fs.mkdirSync(path.join(DATA_DIR, 'bonus'), { recursive: true });
    }
    
    bonusList.forEach(bonus => {
      const filePath = path.join(DATA_DIR, 'bonus', `${bonus.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(bonus, null, 2));
      console.log(`Creato file bonus/${bonus.id}.json`);
    });

    // 5. Crea un file per ogni notizia
    console.log('Creazione dei file dati individuali per le news...');
    if (!fs.existsSync(path.join(DATA_DIR, 'news'))) {
      fs.mkdirSync(path.join(DATA_DIR, 'news'), { recursive: true });
    }
    
    mockNews.forEach(news => {
      const filePath = path.join(DATA_DIR, 'news', `${news.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
      console.log(`Creato file news/${news.id}.json`);
    });

    // 6. Crea un file per ogni tutorial
    console.log('Creazione dei file dati individuali per i tutorial...');
    if (!fs.existsSync(path.join(DATA_DIR, 'tutorials'))) {
      fs.mkdirSync(path.join(DATA_DIR, 'tutorials'), { recursive: true });
    }
    
    mockTutorials.forEach(tutorial => {
      const filePath = path.join(DATA_DIR, 'tutorials', `${tutorial.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(tutorial, null, 2));
      console.log(`Creato file tutorials/${tutorial.id}.json`);
    });

    // 7. Crea i file per i dati del debito pubblico
    console.log('Creazione dei file per i dati del debito pubblico...');
    if (!fs.existsSync(path.join(DATA_DIR, 'public-debt'))) {
      fs.mkdirSync(path.join(DATA_DIR, 'public-debt'), { recursive: true });
    }
    
    Object.keys(currentDebtData).forEach(country => {
      const filePath = path.join(DATA_DIR, 'public-debt', `current-${country.toLowerCase()}.json`);
      fs.writeFileSync(filePath, JSON.stringify(currentDebtData[country], null, 2));
      console.log(`Creato file public-debt/current-${country.toLowerCase()}.json`);
    });

    Object.keys(historicalDebtData).forEach(country => {
      const filePath = path.join(DATA_DIR, 'public-debt', `historical-${country.toLowerCase()}.json`);
      fs.writeFileSync(filePath, JSON.stringify(historicalDebtData[country], null, 2));
      console.log(`Creato file public-debt/historical-${country.toLowerCase()}.json`);
    });

    // 8. Crea un file index.html di fallback per le rotte SPA
    console.log('Creazione del file di fallback per le rotte SPA...');
    fs.copyFileSync(path.join(DIST_DIR, 'index.html'), path.join(DIST_DIR, '404.html'));

    // 9. Creazione di un file vercel.json per il routing corretto se si usa Vercel
    console.log('Creazione del file vercel.json per il routing SPA...');
    const vercelConfig = {
      "version": 2,
      "routes": [
        { "handle": "filesystem" },
        { "src": "/(.*)", "dest": "/index.html" }
      ]
    };
    fs.writeFileSync(path.join(DIST_DIR, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));

    // 10. Creazione di un file netlify.toml per il routing corretto se si usa Netlify
    console.log('Creazione del file netlify.toml per il routing SPA...');
    const netlifyConfig = `
[build]
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
    fs.writeFileSync(path.join(DIST_DIR, 'netlify.toml'), netlifyConfig);

    // 11. Creazione di un file _redirects per il routing corretto su hosting che supportano questo file
    console.log('Creazione del file _redirects per il routing SPA...');
    fs.writeFileSync(path.join(DIST_DIR, '_redirects'), '/* /index.html 200');

    console.log('\nProcesso completato con successo!');
    console.log('La versione statica è pronta per il deployment nella directory "dist"');
    console.log('Questa versione può essere ospitata su qualsiasi piattaforma di hosting statico');
    console.log('(GitHub Pages, Netlify, Vercel, Cloudflare Pages, ecc.)');

  } catch (error) {
    console.error(`Si è verificato un errore: ${error.message}`);
    process.exit(1);
  }
}

// Esecuzione
createStaticVersion();