import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import config from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
});

const db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);

async function generate() {
  try {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mefnegociosinmobiliarios.ar/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    querySnapshot.forEach((doc) => {
      xml += `
  <url>
    <loc>https://mefnegociosinmobiliarios.ar/?propiedad=${doc.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += '\n</urlset>';
    fs.writeFileSync('public/sitemap.xml', xml);
    console.log(`Generated sitemap with ${querySnapshot.size} properties.`);
    process.exit(0);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  }
}
generate();
