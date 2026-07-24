import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwVyvkHSJXgnp0qpM6LRfTYM03TQUXmME",
  authDomain: "gen-lang-client-0536825291.firebaseapp.com",
  projectId: "gen-lang-client-0536825291",
  storageBucket: "gen-lang-client-0536825291.firebasestorage.app",
  messagingSenderId: "797771901405",
  appId: "1:797771901405:web:4087939d706060c375ee34"
};

let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase init warning (running in local mode):', e);
}

export { db, auth };
