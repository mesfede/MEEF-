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

// Helper to generate a fallback description if API key is not present or API call fails
function generateFallbackDescription(data: any): string {
  const { title, type, operation, city, zone, coveredArea, bedrooms, bathrooms, priceARS, priceUSD, amenities } = data;
  const opText = operation === 'VENTA' ? 'en Venta' : operation === 'ALQUILER' ? 'en Alquiler' : 'disponible';
  const locationText = city || zone || 'General La Madrid';
  const propTitle = title || `${type || 'Propiedad'} ${opText}`;

  const amenitiesList = Array.isArray(amenities) && amenities.length > 0 
    ? amenities.join(', ') 
    : 'Servicios conectados y excelentes comodidades';

  const specsText = [
    bedrooms ? `${bedrooms} dormitorio${bedrooms > 1 ? 's' : ''}` : null,
    bathrooms ? `${bathrooms} baño${bathrooms > 1 ? 's' : ''}` : null,
    coveredArea ? `${coveredArea} m² cubiertos` : null,
  ].filter(Boolean).join(', ');

  return `Excelente oportunidad inmobiliaria: ${propTitle} ${opText} en ${locationText}.

Esta propiedad se destaca por su sólida construcción, distribución funcional y ambientes luminosos. ${specsText ? `Cuenta con ${specsText}.` : ''}

Características principales:
- Ubicación estratégica en ${locationText} con excelente accesibilidad.
- Comodidades y servicios: ${amenitiesList}.
- Ideal tanto para residencia familiar como para inversión a largo plazo.

Contactanos en MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios para coordinar una visita personalizada o recibir asesoramiento profesional sin compromiso.`;
}

// AI Description Generator endpoint
app.post('/api/generate-description', async (req, res) => {
  try {
    const { title, type, operation, city, zone, priceARS, priceUSD, coveredArea, bedrooms, bathrooms, amenities } = req.body;
    const locationText = city || zone || 'General La Madrid';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Actúa como un experto asesor inmobiliario senior de MEF Negocios Inmobiliarios en General La Madrid, Buenos Aires.
Redacta una descripción comercial, atractiva, profesional y vendedora para una propiedad con las siguientes características:
- Título: ${title || 'Propiedad en venta/alquiler'}
- Tipo: ${type || 'Inmueble'}
- Operación: ${operation || 'VENTA'}
- Ciudad / Ubicación: ${locationText}
- Superficie cubierta: ${coveredArea || 'N/D'} m²
- Habitaciones: ${bedrooms || 'N/D'}
- Baños: ${bathrooms || 'N/D'}
- Precio ARS: ${priceARS ? `$${priceARS}` : 'A consultar'}
- Precio USD: ${priceUSD ? `USD $${priceUSD}` : 'A consultar'}
- Servicios y Comodidades: ${Array.isArray(amenities) ? amenities.join(', ') : 'N/D'}

La descripción debe estar redactada en español fluido, destacar los puntos fuertes de la propiedad, generar interés en posibles compradores o inquilinos, incluir formato profesional con párrafos claros, y un tono cálido y profesional. No incluyas placeholders ni corchetes. Solo el texto redactado listo para publicar.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text && response.text.trim().length > 0) {
          return res.json({ description: response.text.trim() });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart generator:', geminiError);
      }
    }

    // Fallback if API key is missing or call failed
    const fallbackDesc = generateFallbackDescription(req.body);
    res.json({ description: fallbackDesc });
  } catch (err: any) {
    console.error('Error generating AI description:', err);
    res.json({ description: generateFallbackDescription(req.body) });
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

