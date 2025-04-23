import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
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
 * Funzione per autenticarsi con Google
 * @returns Promise con il risultato dell'autenticazione
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    // Configura il provider per selezionare l'account
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    // Effettua l'autenticazione con il popup
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Errore durante l'autenticazione con Google:", error);
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