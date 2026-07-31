import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// API health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'MEF Negocios Inmobiliarios' });
});

// AI Description Generator endpoint
app.post('/api/generate-description', async (req, res) => {
  try {
    const { title, type, operation, zone, priceARS, priceUSD, coveredArea, bedrooms, bathrooms, amenities } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Actúa como un experto asesor inmobiliario senior de MEF Negocios Inmobiliarios en General La Madrid, Buenos Aires.
Redacta una descripción comercial, atractiva, profesional y vendedora para una propiedad con las siguientes características:
- Título: ${title || 'Propiedad en venta/alquiler'}
- Tipo: ${type || 'Inmueble'}
- Operación: ${operation || 'VENTA'}
- Zona: ${zone || 'General La Madrid'}
- Superficie cubierta: ${coveredArea || 'N/D'} m²
- Habitaciones: ${bedrooms || 'N/D'}
- Baños: ${bathrooms || 'N/D'}
- Precio ARS: ${priceARS ? `$${priceARS}` : 'A consultar'}
- Precio USD: ${priceUSD ? `USD $${priceUSD}` : 'A consultar'}
- Servicios y Comodidades: ${Array.isArray(amenities) ? amenities.join(', ') : 'N/D'}

La descripción debe estar redactada en español fluido, destacar los puntos fuertes de la propiedad, generar interés en posibles compradores o inquilinos, incluir formato profesional con párrafos claros, y un tono cálido y profesional. No incluyas placeholders ni corchetes. Solo el texto redactado listo para publicar.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const description = response.text || '';
    res.json({ description });
  } catch (err: any) {
    console.error('Error generating AI description:', err);
    res.status(500).json({ error: err.message || 'Error generating description' });
  }
});

const distPath = path.join(process.cwd(), 'dist');

// Build frontend if dist/index.html doesn't exist
if (!fs.existsSync(path.join(distPath, 'index.html'))) {
  console.log('Building application for production preview...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
  } catch (err) {
    console.error('Startup build failed:', err);
  }
}

// Serve static files
app.use(express.static(distPath));

// SPA fallback route
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

