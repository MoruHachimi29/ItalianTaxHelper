console.log('Questo file è un placeholder. La vera applicazione è in vue-app/');

// Verifica se siamo su Replit
const isReplit = window.location.hostname.includes('replit');

// Non reindirizzare, mostra solo il messaggio
document.body.innerHTML = `
<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
  <div style="max-width: 600px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="margin-top: 0; color: #333;">F24Editabile - Vue.js</h1>
    <p>L'applicazione è stata migrata a Vue.js. Per avviare correttamente l'applicazione:</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 8px; border: 1px solid #b3d8ff;">
      <strong>In ambiente Replit:</strong>
      <ol style="margin-top: 10px; padding-left: 20px;">
        <li>Apri una nuova shell nel riquadro "Shell"</li>
        <li>Esegui: <code style="background: #f1f1f1; padding: 2px 4px; border-radius: 3px;">./start-vue.sh</code></li>
        <li>Utilizza l'URL generato per accedere all'app Vue.js</li>
      </ol>
    </div>
    
    <p>Per una migliore esperienza, segui le istruzioni nel README.md del progetto.</p>
    
    <div style="margin-top: 20px; padding: 10px; background-color: #fff8e6; border-left: 4px solid #ffcc00; border-radius: 4px;">
      <strong>Nota:</strong> In ambiente di produzione (deployment), l'app Vue.js verrà servita automaticamente
      attraverso il file <code>server/deploy-index.js</code>.
    </div>
    
    <div style="margin-top: 20px; text-align: center;">
      <button 
        onclick="window.location.reload()" 
        style="padding: 10px 20px; background: #000; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
      >
        Ricarica pagina
      </button>
    </div>
  </div>
</div>
`;