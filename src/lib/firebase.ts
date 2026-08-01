import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey,
  authDomain: firebaseAppletConfig.authDomain,
  projectId: firebaseAppletConfig.projectId,
  storageBucket: firebaseAppletConfig.storageBucket,
  messagingSenderId: firebaseAppletConfig.messagingSenderId,
  appId: firebaseAppletConfig.appId,
};

const DATABASE_ID = firebaseAppletConfig.firestoreDatabaseId;

let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = DATABASE_ID ? getFirestore(app, DATABASE_ID) : getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase init warning:', e);
}

export { db, auth };

