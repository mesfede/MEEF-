import React, { useEffect } from 'react';
import { Property, SearchFilters } from '../types';

interface SEOHeadProps {
  selectedProperty?: Property | null;
  filters?: SearchFilters;
  totalProperties?: number;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  selectedProperty,
  filters,
  totalProperties = 0,
}) => {
  useEffect(() => {
    const siteName = 'MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios';
    const baseUrl = 'https://mefnegociosinmobiliarios.ar/';

    let title = `${siteName} | Inmobiliaria en General La Madrid`;
    let description =
      'Inmobiliaria en General La Madrid (Buenos Aires). Venta, alquiler y tasaciones profesionales de casas, departamentos, terrenos, quintas y campos. Contactanos con atención personalizada por María Eugenia Fernández.';
    let imageUrl = 'https://mefnegociosinmobiliarios.ar/mef-logo.png';
    let pageUrl = baseUrl;
    let schemaType = 'RealEstateAgent';

    if (selectedProperty) {
      const opText =
        selectedProperty.operation === 'VENTA'
          ? 'en Venta'
          : selectedProperty.operation === 'ALQUILER'
          ? 'en Alquiler'
          : 'en Alquiler Temporal';
      const cityText = selectedProperty.location?.city || selectedProperty.location?.zone || 'General La Madrid';
      
      title = `${selectedProperty.title} ${opText} en ${cityText} | ${siteName}`;
      
      const specs = [
        selectedProperty.bedrooms ? `${selectedProperty.bedrooms} dorm.` : null,
        selectedProperty.bathrooms ? `${selectedProperty.bathrooms} baño${selectedProperty.bathrooms > 1 ? 's' : ''}` : null,
        selectedProperty.coveredArea ? `${selectedProperty.coveredArea} m² cubiertos` : null,
      ].filter(Boolean).join(' · ');

      const priceText = selectedProperty.priceUSD 
        ? `USD $${selectedProperty.priceUSD.toLocaleString('es-AR')}`
        : selectedProperty.priceARS 
        ? `$${selectedProperty.priceARS.toLocaleString('es-AR')}`
        : 'Consultar precio';

      description = `${selectedProperty.title} ${opText} en ${cityText}. ${priceText}. ${specs ? `${specs}. ` : ''}${selectedProperty.description ? selectedProperty.description.substring(0, 140) + '...' : 'Tasaciones y gestión inmobiliaria profesional.'}`;
      
      if (selectedProperty.images && selectedProperty.images.length > 0) {
        imageUrl = selectedProperty.images[0];
      }
      pageUrl = `${baseUrl}?propiedad=${selectedProperty.id}`;
      schemaType = 'SingleFamilyResidence';
    } else if (filters && filters.operation !== 'TODAS') {
      const opName =
        filters.operation === 'VENTA'
          ? 'en Venta'
          : filters.operation === 'ALQUILER'
          ? 'en Alquiler'
          : 'Lotes y Terrenos';
      title = `Propiedades ${opName} en General La Madrid | ${siteName}`;
      description = `Catálogo de propiedades ${opName.toLowerCase()} en General La Madrid y la región. Casas, departamentos, lotes y campos. Asesoramiento inmobiliario con María Eugenia Fernández.`;
      pageUrl = `${baseUrl}?operacion=${filters.operation}`;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const updateMeta = (selector: string, attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${selector}]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard & Search Meta
    updateMeta('name="description"', 'name', 'description', description);
    updateMeta('name="title"', 'name', 'title', title);
    updateLink('canonical', pageUrl);

    // OpenGraph (Facebook / WhatsApp)
    updateMeta('property="og:title"', 'property', 'og:title', title);
    updateMeta('property="og:description"', 'property', 'og:description', description);
    updateMeta('property="og:image"', 'property', 'og:image', imageUrl);
    updateMeta('property="og:url"', 'property', 'og:url', pageUrl);

    // Twitter Cards
    updateMeta('property="twitter:title"', 'property', 'twitter:title', title);
    updateMeta('property="twitter:description"', 'property', 'twitter:description', description);
    updateMeta('property="twitter:image"', 'property', 'twitter:image', imageUrl);

    // 3. Dynamic JSON-LD Structured Data for Google Rich Snippets
    let jsonLdData: any;

    if (selectedProperty) {
      jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        'name': selectedProperty.title,
        'description': selectedProperty.description || description,
        'url': pageUrl,
        'image': selectedProperty.images || [imageUrl],
        'offers': {
          '@type': 'Offer',
          'price': selectedProperty.priceUSD || selectedProperty.priceARS || 0,
          'priceCurrency': selectedProperty.priceUSD ? 'USD' : 'ARS',
          'availability': 'https://schema.org/InStock',
          'seller': {
            '@type': 'RealEstateAgent',
            'name': siteName,
            'telephone': '+5492284603168',
            'url': baseUrl,
          },
        },
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': selectedProperty.location?.city || selectedProperty.location?.zone || 'General La Madrid',
          'addressRegion': 'Buenos Aires',
          'addressCountry': 'AR',
        },
      };

      if (selectedProperty.bedrooms) jsonLdData.numberOfRooms = selectedProperty.bedrooms;
      if (selectedProperty.bathrooms) jsonLdData.numberOfBathroomsTotal = selectedProperty.bathrooms;
    } else {
      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          'name': siteName,
          'image': 'https://mefnegociosinmobiliarios.ar/mef-logo.png',
          'telephone': '+5492284603168',
          'email': 'contacto@mefnegociosinmobiliarios.ar',
          'url': baseUrl,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'General La Madrid',
            'addressLocality': 'General La Madrid',
            'addressRegion': 'Buenos Aires',
            'postalCode': '7340',
            'addressCountry': 'AR',
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': -37.2476,
            'longitude': -61.2618,
          },
          'priceRange': '$$',
          'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens': '08:30',
            'closes': '19:30',
          },
          'sameAs': [
            'https://www.instagram.com/mef_negociosinmobiliarios/',
            'https://wa.me/5492284603168',
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': siteName,
          'url': baseUrl,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${baseUrl}?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ];
    }

    // Inject or replace JSON-LD element in document body / head
    let scriptEl = document.getElementById('dynamic-json-ld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'dynamic-json-ld';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLdData);

  }, [selectedProperty, filters, totalProperties]);

  return null;
};
