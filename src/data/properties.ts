import { Property } from '../types';

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'mef-101',
    refCode: 'MEF-GLM01',
    title: 'Casa Residencial 4 Ambientes con Gran Parque y Quincho',
    operation: 'VENTA',
    type: 'Casa',
    priceUSD: 115000,
    priceARS: 155250000,
    expensesARS: 0,
    location: {
      zone: 'General La Madrid - Centro',
      address: 'Calle San Martín 650',
      city: 'General La Madrid',
      lat: -37.2483,
      lng: -61.2619,
    },
    coveredArea: 185,
    totalArea: 600,
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    description: 'Excelente propiedad ubicada en pleno centro de General La Madrid. Cuenta con amplio living comedor con hogar a leña, cocina comedor diario totalmente equipada, 3 dormitorios luminosos con placares empotrados y baño principal. Gran parque arbolado con quincho independiente completo (parrilla, mesada y lavadero). Garaje cubierto para dos vehículos. Todos los servicios conectados (gas natural, agua corriente, cloacas, fibra óptica).',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    isRecentlyUploaded: true, // DESTACADO RECIEN SUBIDA
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-house-exterior-with-a-pool-and-lawn-41002-large.mp4',
    videoType: 'mp4',
    instagramUrl: 'https://www.instagram.com/reel/C3_GLM_MEF/',
    amenities: ['Parrilla', 'Cochera', 'Acepta Mascotas', 'Apto Crédito', 'Jardín', 'Gas Natural'],
    agent: {
      name: 'María Eugenia Fernández',
      phone: '+54 9 11 5521 8899',
      email: 'contacto@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-21'
  },
  {
    id: 'mef-102',
    refCode: 'MEF-GLM02',
    title: 'Casa Quinta con Pileta y Galería en Parque Cabañas',
    operation: 'VENTA',
    type: 'Quinta / Campo',
    priceUSD: 145000,
    priceARS: 195750000,
    expensesARS: 0,
    location: {
      zone: 'General La Madrid - Parque Cabañas',
      address: 'Av. Uriburu y Acceso Parque',
      city: 'General La Madrid',
      lat: -37.2550,
      lng: -61.2710,
    },
    coveredArea: 160,
    totalArea: 2500,
    bedrooms: 2,
    bathrooms: 2,
    garages: 2,
    description: 'Hermosa casa quinta ideal para descanso o vivienda permanente. Emplazada sobre una hectárea y media con añosa arboleda (pino, eucalipto, frutales). Piscina de material con solárium e iluminación LED, amplia galería semicubierta con parrilla y horno de barro. Casa principal de 2 dormitorios, estar con salamandra a leña y cocina rústica.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    isRecentlyUploaded: false,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-large-property-with-green-grass-41484-large.mp4',
    videoType: 'mp4',
    instagramUrl: 'https://www.instagram.com/reel/C2_QUINTA_MEF/',
    amenities: ['Pileta', 'Parrilla', 'Jardín', 'Cochera', 'Acepta Mascotas'],
    agent: {
      name: 'María Eugenia Fernández',
      phone: '+54 9 11 5521 8899',
      email: 'contacto@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-19'
  },
  {
    id: 'mef-103',
    refCode: 'MEF-L301',
    title: 'Terreno de 800m² sobre Asfalto con Servicios',
    operation: 'LOTES',
    type: 'Lote / Terreno',
    priceUSD: 28000,
    priceARS: 37800000,
    expensesARS: 0,
    location: {
      zone: 'General La Madrid - Villa La Gama',
      address: 'Calle Mitre al 800',
      city: 'General La Madrid',
      lat: -37.2420,
      lng: -61.2580,
    },
    coveredArea: 0,
    totalArea: 800,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    description: 'Excelente lote de terreno ubicado en barrio Villa La Gama, zona de continuo crecimiento residencial en General La Madrid. Terreno nivellado, limpio y cercado. Frente sobre calle asfaltada con alumbrado público, gas natural, agua y electricidad en puerta. Listo para escriturar.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    isNewDevelopment: true,
    lotFeatures: {
      frontageMeters: 20,
      depthMeters: 40,
      waterAccess: false,
      cornerLot: false
    },
    amenities: ['Financiado', 'Gas Natural', 'Apto Construcción'],
    agent: {
      name: 'Federico MEF',
      phone: '+54 9 11 4410 7722',
      email: 'ventas@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-18'
  },
  {
    id: 'mef-104',
    refCode: 'MEF-ALQ01',
    title: 'Casa 3 Ambientes Luminosa en Alquiler',
    operation: 'ALQUILER',
    type: 'Casa',
    priceUSD: 320,
    priceARS: 420000,
    expensesARS: 0,
    location: {
      zone: 'General La Madrid - Barrio Chino',
      address: 'Calle Alsina 420',
      city: 'General La Madrid',
      lat: -37.2450,
      lng: -61.2640,
    },
    coveredArea: 95,
    totalArea: 250,
    bedrooms: 2,
    bathrooms: 1,
    garages: 1,
    description: 'Casa en impecable estado disponible para alquiler. Posee living estar, cocina comedor remodelada, dos dormitorios confortables con calefactores tiro balanceado, baño completo renovado y patio chico con parrilla. Entrada para auto con portón.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-with-furniture-41481-large.mp4',
    videoType: 'mp4',
    instagramUrl: 'https://www.instagram.com/reel/C1_ALQ_GLM/',
    amenities: ['Parrilla', 'Cochera', 'Acepta Mascotas', 'Gas Natural'],
    agent: {
      name: 'María Eugenia Fernández',
      phone: '+54 9 11 5521 8899',
      email: 'contacto@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-20'
  },
  {
    id: 'mef-105',
    refCode: 'MEF-LAP01',
    title: 'Casa Familiar 4 Ambientes con Patio en Laprida',
    operation: 'VENTA',
    type: 'Casa',
    priceUSD: 85000,
    priceARS: 114750000,
    expensesARS: 0,
    location: {
      zone: 'Laprida',
      address: 'Calle Pellegrini 780',
      city: 'Laprida',
      lat: -37.5444,
      lng: -60.7981,
    },
    coveredArea: 140,
    totalArea: 420,
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    description: 'Propiedad en venta en la vecina localidad de Laprida. Muy buena estructura edilicia. Living comedor al frente, cocina amplia, 3 dormitorios, baño completo, garage cerrado con fogón/parrilla y patio seco + jardín de césped. Todos los servicios.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-living-room-of-a-modern-house-41480-large.mp4',
    videoType: 'mp4',
    instagramUrl: 'https://www.instagram.com/reel/C0_LAPRIDA_MEF/',
    amenities: ['Parrilla', 'Cochera', 'Jardín', 'Gas Natural', 'Apto Crédito'],
    agent: {
      name: 'Federico MEF',
      phone: '+54 9 11 4410 7722',
      email: 'ventas@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-15'
  },
  {
    id: 'mef-106',
    refCode: 'MEF-CSU01',
    title: 'Casa Tipo Chalet de Estilo en Coronel Suárez',
    operation: 'VENTA',
    type: 'Casa',
    priceUSD: 130000,
    priceARS: 175500000,
    expensesARS: 0,
    location: {
      zone: 'Coronel Suárez',
      address: 'Av. Casey 1120',
      city: 'Coronel Suárez',
      lat: -37.4547,
      lng: -61.9334,
    },
    coveredArea: 210,
    totalArea: 550,
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    description: 'Chalet señorial en Coronel Suárez. Materiales nobles, aberturas de madera maciza, calefacción central por radiadores. Suite principal, vestidor, quincho espacioso con parrillero y piscina de fibra con deck de madera.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    amenities: ['Pileta', 'Parrilla', 'Cochera', 'Jardín', 'Gas Natural'],
    agent: {
      name: 'María Eugenia Fernández',
      phone: '+54 9 11 5521 8899',
      email: 'contacto@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-12'
  },
  {
    id: 'mef-107',
    refCode: 'MEF-LOC01',
    title: 'Local Comercial Céntrico Excelente Vidriera sobre San Martín',
    operation: 'ALQUILER',
    type: 'Local / Oficina',
    priceUSD: 250,
    priceARS: 310000,
    expensesARS: 0,
    location: {
      zone: 'General La Madrid - Centro',
      address: 'Calle San Martín 520',
      city: 'General La Madrid',
      lat: -37.2478,
      lng: -61.2612,
    },
    coveredArea: 70,
    totalArea: 70,
    bedrooms: 0,
    bathrooms: 1,
    garages: 0,
    description: 'Local comercial en la mejor arteria céntrica de General La Madrid. Amplia vidriera a la calle, salón de ventas sin columnas, depósito en el fondo y baño privado. Ideal para rubro indumentaria, oficina o servicios.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    amenities: ['Gas Natural', 'Apto Comercial'],
    agent: {
      name: 'María Eugenia Fernández',
      phone: '+54 9 11 5521 8899',
      email: 'contacto@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-17'
  },
  {
    id: 'mef-108',
    refCode: 'MEF-CMP01',
    title: 'Fracción / Campo Mixto de 45 Hectáreas Cercano a La Madrid',
    operation: 'VENTA',
    type: 'Quinta / Campo',
    priceUSD: 260000,
    priceARS: 351000000,
    expensesARS: 0,
    location: {
      zone: 'General La Madrid - Zona Rural / Campos',
      address: 'Ruta Provincial 86 Km 12',
      city: 'General La Madrid',
      lat: -37.2800,
      lng: -61.3000,
    },
    coveredArea: 120,
    totalArea: 450000,
    bedrooms: 2,
    bathrooms: 1,
    garages: 1,
    description: 'Fracción de campo ideal para desarrollo agrícola-ganadero o recreativo. Cuenta con manga, corrales, aguada permanente con molino de viento y pequeña casa de puestero a refaccionar. Excelente acceso sobre ruta asfaltada.',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-large-property-with-green-grass-41484-large.mp4',
    videoType: 'mp4',
    instagramUrl: 'https://www.instagram.com/reel/C0_CAMPO_MEF/',
    amenities: ['Financiado', 'Apto Agrícola'],
    agent: {
      name: 'Federico MEF',
      phone: '+54 9 11 4410 7722',
      email: 'ventas@mefnegociosinmobiliarios.ar',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
    },
    createdAt: '2026-07-16'
  }
];

export const ZONES_LIST = [
  'Todas las zonas',
  'General La Madrid - Centro',
  'General La Madrid - Villa La Gama',
  'General La Madrid - Barrio Chino',
  'General La Madrid - Parque Cabañas',
  'General La Madrid - Zona Rural / Campos',
  'Laprida',
  'Coronel Suárez',
  'Daireaux',
  'Olavarría',
  'Líbano / Las Martinetas / Pontaut'
];

export const AMENITIES_LIST = [
  'Parrilla',
  'Pileta',
  'Jardín',
  'Cochera',
  'Gas Natural',
  'Acepta Mascotas',
  'Apto Crédito',
  'Apto Comercial',
  'Financiado',
  'Apto Construcción',
  'Video Tour / Reel IG'
];

