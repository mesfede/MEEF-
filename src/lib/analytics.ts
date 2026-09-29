// Google Analytics 4 tracking helpers for MEF Negocios Inmobiliarios

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-XBTT6KYD0X';

/**
 * Send a generic event to Google Analytics 4
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (error) {
    // Non-blocking fail-safe
    console.debug('Analytics error:', error);
  }
}

/**
 * Track when a user views a property in detail
 */
export function trackPropertyView(property: {
  id: string;
  title: string;
  type?: string;
  operation?: string;
  price?: number;
  currency?: string;
  city?: string;
}) {
  trackEvent('view_item', {
    item_id: property.id,
    item_name: property.title,
    item_category: property.type || 'Inmueble',
    item_variant: property.operation || 'Venta',
    location_id: property.city || 'General La Madrid',
    value: property.price || 0,
    currency: property.currency || 'USD',
  });
}

/**
 * Track WhatsApp contact conversions
 */
export function trackWhatsAppClick(source: string, propertyTitle?: string) {
  trackEvent('generate_lead', {
    method: 'whatsapp',
    lead_source: source,
    property_title: propertyTitle || 'General',
  });
}

/**
 * Track phone call click
 */
export function trackPhoneClick(source: string) {
  trackEvent('contact', {
    method: 'phone',
    contact_source: source,
  });
}
