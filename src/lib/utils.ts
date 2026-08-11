/// <reference types="vite/client" />
export const getAssetUrl = (path: string): string => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};

/**
 * Cleanly formats location (zone & city) avoiding duplicate "General La Madrid, General La Madrid" strings.
 */
export const formatLocationName = (zone?: string, city?: string): string => {
  const cleanCity = (city || 'General La Madrid').trim();
  let cleanZone = (zone || '').trim();

  if (!cleanZone || cleanZone.toLowerCase() === cleanCity.toLowerCase()) {
    return cleanCity;
  }

  // Strip redundant prefix/suffix like "General La Madrid - "
  if (cleanZone.toLowerCase().startsWith(cleanCity.toLowerCase() + ' - ')) {
    cleanZone = cleanZone.slice(cleanCity.length + 3).trim();
  } else if (cleanZone.toLowerCase().startsWith(cleanCity.toLowerCase() + ' ')) {
    cleanZone = cleanZone.slice(cleanCity.length + 1).trim();
  } else if (cleanZone.toLowerCase().endsWith(' - ' + cleanCity.toLowerCase())) {
    cleanZone = cleanZone.slice(0, cleanZone.length - (cleanCity.length + 3)).trim();
  }

  if (!cleanZone || cleanZone.toLowerCase() === cleanCity.toLowerCase()) {
    return cleanCity;
  }

  return `${cleanZone}, ${cleanCity}`;
};

/**
 * Cleanly formats full street address + zone + city without repeating city or zone.
 */
export const formatFullAddress = (address?: string, zone?: string, city?: string): string => {
  const locName = formatLocationName(zone, city);
  const cleanAddr = (address || '').trim();

  if (!cleanAddr) return locName;

  // Avoid appending location if address already contains locality or zone
  if (cleanAddr.toLowerCase().includes(locName.toLowerCase())) {
    return cleanAddr;
  }

  return `${cleanAddr}, ${locName}`;
};

