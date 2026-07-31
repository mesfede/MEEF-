import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwVyvkHSJXgnp0qpM6LRfTYM03TQUXmME",
  authDomain: "gen-lang-client-0536825291.firebaseapp.com",
  projectId: "gen-lang-client-0536825291",
  storageBucket: "gen-lang-client-0536825291.firebasestorage.app",
  messagingSenderId: "797771901405",
  appId: "1:797771901405:web:4087939d706060c375ee34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const snapshot = await getDocs(collection(db, 'properties'));
  console.log('Total properties in Firestore:', snapshot.size);
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data().title);
  });
  process.exit(0);
}
check().catch(console.error);
