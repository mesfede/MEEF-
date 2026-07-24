export type OperationType = 'VENTA' | 'ALQUILER' | 'LOTES';

export type PropertyType = 
  | 'Casa' 
  | 'Departamento' 
  | 'Lote / Terreno' 
  | 'Barrio Cerrado' 
  | 'PH' 
  | 'Local / Oficina' 
  | 'Quinta / Campo';

export interface Property {
  id: string;
  refCode: string;
  title: string;
  operation: OperationType;
  type: PropertyType;
  priceUSD: number;
  priceARS?: number;
  expensesARS?: number;
  location: {
    zone: string; // e.g., 'Nordelta', 'Tigre', 'San Isidro', 'Pilar', 'Belgrano'
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  coveredArea: number; // m2
  totalArea: number; // m2
  bedrooms: number;
  bathrooms: number;
  garages: number;
  description: string;
  images: string[];
  featured?: boolean;
  isNewDevelopment?: boolean;
  isRecentlyUploaded?: boolean;
  videoUrl?: string; // MP4 video URL or embed link
  videoType?: 'mp4' | 'youtube' | 'instagram';
  instagramUrl?: string; // Link to Instagram post / reel
  amenities: string[];
  lotFeatures?: {
    frontageMeters?: number;
    depthMeters?: number;
    waterAccess?: boolean;
    cornerLot?: boolean;
    fosiFos?: string;
  };
  agent: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
}

export interface SearchFilters {
  operation: OperationType | 'TODAS';
  propertyType: PropertyType | 'TODOS';
  zone: string;
  minPrice: number;
  maxPrice: number;
  currency: 'USD' | 'ARS';
  minBedrooms: number;
  minBathrooms: number;
  minCoveredArea: number;
  amenities: string[];
  onlyFeatured: boolean;
  onlyWithVideo?: boolean;
  onlyRecentlyUploaded?: boolean;
  refCodeSearch: string;
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'area-desc';
}

export interface ValuationRequest {
  fullName: string;
  email: string;
  phone: string;
  propertyType: PropertyType;
  operationType: OperationType;
  address: string;
  cityZone: string;
  totalArea: string;
  bedrooms: string;
  comments: string;
}
