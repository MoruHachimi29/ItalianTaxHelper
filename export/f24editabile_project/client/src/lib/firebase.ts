import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider, 
  UserCredential
} from "firebase/auth";

// Definiamo il tipo FirebaseUser
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Configurazione Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Ottieni l'istanza di autenticazione
const auth = getAuth(app);

// Provider per Google
const googleProvider = new GoogleAuthProvider();

/**
 * Funzione per autenticarsi con Google tramite redirect
 * Questo metodo avvia il flusso di autenticazione redirect
 */
export async function signInWithGoogle(): Promise<void> {
  try {
    // Configura il provider per selezionare l'account
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    // Effettua l'autenticazione con redirect invece di popup
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Errore durante l'autenticazione con Google:", error);
    throw error;
  }
}

/**
 * Funzione per ottenere il risultato del redirect di autenticazione
 * Da chiamare quando l'utente viene reindirizzato all'applicazione
 */
export async function getGoogleAuthResult(): Promise<UserCredential | null> {
  try {
    return await getRedirectResult(auth);
  } catch (error) {
    console.error("Errore durante il recupero del risultato di autenticazione:", error);
    throw error;
  }
}

/**
 * Funzione per effettuare il logout da Firebase
 */
export async function signOut(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Errore durante il logout:", error);
    throw error;
  }
}

// Il tipo FirebaseUser è già esportato tramite l'interfaccia

// Esporta l'istanza di autenticazione
export { auth };