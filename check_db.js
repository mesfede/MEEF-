import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);
const app = initializeApp(config);
const db = getFirestore(app);

async function check() {
  const snapshot = await getDocs(collection(db, 'properties'));
  console.log('Total properties in Firestore:', snapshot.size);
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data().title);
  });
}
check().catch(console.error);
