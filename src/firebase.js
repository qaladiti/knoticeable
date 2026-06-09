/**
 * Firebase Configuration — Knoticeable
 * 
 * NOTE: Replace these placeholder values with your actual Firebase project config.
 * Get your config from: Firebase Console → Project Settings → General → Your apps
 */

// Firebase is loaded as an ES module via the npm package
// For demo purposes, we use a mock/fallback when Firebase isn't configured

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// State
let app = null;
let auth = null;
let db = null;
let storage = null;
let isInitialized = false;

/**
 * Initialize Firebase (lazy, only when needed)
 */
export async function initFirebase() {
  if (isInitialized) return { app, auth, db, storage };
  
  try {
    const { initializeApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');
    const { getStorage } = await import('firebase/storage');
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isInitialized = true;
    
    console.log('🔥 Firebase initialized');
    return { app, auth, db, storage };
  } catch (err) {
    console.warn('⚠️ Firebase not configured. Running in demo mode.', err.message);
    return { app: null, auth: null, db: null, storage: null };
  }
}

export function getFirebaseAuth() { return auth; }
export function getFirebaseDb() { return db; }
export function getFirebaseStorage() { return storage; }

/**
 * Demo mode flag — used when Firebase isn't configured
 */
export function isDemoMode() {
  return !isInitialized || firebaseConfig.apiKey === 'YOUR_API_KEY';
}
