import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Property } from '../types';
import { PROPERTIES_DATA } from '../data/properties';

const PROPERTIES_COLLECTION = 'properties';
const DELETED_PROPERTIES_KEY = 'mef_deleted_property_ids';
const CUSTOM_PROPERTIES_KEY = 'mef_custom_properties';

export const getDeletedPropertyIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_PROPERTIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markPropertyAsDeletedLocal = (id: string) => {
  try {
    const current = getDeletedPropertyIds();
    if (!current.includes(id)) {
      localStorage.setItem(DELETED_PROPERTIES_KEY, JSON.stringify([...current, id]));
      window.dispatchEvent(new Event('mef_local_properties_updated'));
    }
  } catch (e) {
    console.warn('Error marking property as deleted locally:', e);
  }
};

export const getCustomLocalProperties = (): Property[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomLocalProperty = (property: Property) => {
  try {
    const current = getCustomLocalProperties();
    const idx = current.findIndex((p) => p.id === property.id || (p.refCode && p.refCode === property.refCode));
    if (idx >= 0) {
      current[idx] = property;
    } else {
      current.unshift(property);
    }
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  } catch (e) {
    console.warn('Error saving custom property to localStorage:', e);
  }
};

export const removeCustomLocalProperty = (id: string) => {
  try {
    const current = getCustomLocalProperties();
    const filtered = current.filter((p) => p.id !== id);
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  } catch (e) {
    console.warn('Error removing custom property from localStorage:', e);
  }
};

// Helper to convert Firestore doc to Property
const mapDocToProperty = (id: string, data: any): Property => {
  return {
    id,
    refCode: data.refCode || `MEF-${id.slice(0, 5).toUpperCase()}`,
    title: data.title || 'Propiedad sin título',
    operation: data.operation || 'VENTA',
    type: data.type || 'Casa',
    priceUSD: Number(data.priceUSD) || 0,
    priceARS: data.priceARS ? Number(data.priceARS) : undefined,
    expensesARS: data.expensesARS ? Number(data.expensesARS) : 0,
    location: {
      zone: data.location?.zone || 'General La Madrid - Centro',
      address: data.location?.address || '',
      city: data.location?.city || 'General La Madrid',
      lat: Number(data.location?.lat) || -37.2483,
      lng: Number(data.location?.lng) || -61.2619,
    },
    coveredArea: Number(data.coveredArea) || 0,
    totalArea: Number(data.totalArea) || 0,
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    garages: Number(data.garages) || 0,
    description: data.description || '',
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    featured: Boolean(data.featured),
    isNewDevelopment: Boolean(data.isNewDevelopment),
    isRecentlyUploaded: Boolean(data.isRecentlyUploaded),
    videoUrl: data.videoUrl || '',
    videoType: data.videoType || (data.videoUrl?.includes('youtube') ? 'youtube' : 'mp4'),
    instagramUrl: data.instagramUrl || '',
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    agent: {
      name: data.agent?.name || 'María Eugenia Fernández',
      phone: data.agent?.phone || '+54 9 11 5521 8899',
      email: data.agent?.email || 'contacto@mefnegociosinmobiliarios.ar',
      avatar: data.agent?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: data.createdAt || new Date().toISOString().split('T')[0],
  };
};

const getCombinedLocalProperties = (): Property[] => {
  const deletedIds = getDeletedPropertyIds();
  const customLocal = getCustomLocalProperties();

  const customFiltered = customLocal.filter((p) => !deletedIds.includes(p.id));
  const customIds = new Set(customFiltered.map((p) => p.id));
  const customRefCodes = new Set(customFiltered.map((p) => p.refCode).filter(Boolean));

  // Merge sample catalog properties that aren't deleted or overridden
  const sampleFiltered = PROPERTIES_DATA.filter(
    (p) =>
      !deletedIds.includes(p.id) &&
      !customIds.has(p.id) &&
      (!p.refCode || !customRefCodes.has(p.refCode))
  );

  const list: Property[] = [...customFiltered, ...sampleFiltered];

  // Sort properties to prevent random jumping
  list.sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    } else if (a.displayOrder !== undefined) {
      return -1;
    } else if (b.displayOrder !== undefined) {
      return 1;
    }

    if (a.isRecentlyUploaded && !b.isRecentlyUploaded) return -1;
    if (!a.isRecentlyUploaded && b.isRecentlyUploaded) return 1;
    
    const dateA = new Date(a.createdAt || '2000-01-01').getTime();
    const dateB = new Date(b.createdAt || '2000-01-01').getTime();
    if (dateA !== dateB) return dateB - dateA;
    
    return a.id.localeCompare(b.id);
  });

  return list;
};

/**
 * Subscribe to realtime properties list from Firestore.
 * Merges Firestore documents with sample catalog properties without losing un-edited properties.
 */
export const subscribeToProperties = (
  onUpdate: (properties: Property[], isFromFirebase: boolean) => void,
  onError?: (err: any) => void
) => {
  try {
    const handleLocalUpdate = () => onUpdate(getCombinedLocalProperties(), false);
    
    // ALWAYS load local properties instantly first to prevent empty state if Firebase hangs
    handleLocalUpdate();

    if (!db) {
      window.addEventListener('mef_local_properties_updated', handleLocalUpdate);
      return () => {
        window.removeEventListener('mef_local_properties_updated', handleLocalUpdate);
      };
    }

    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const q = query(propertiesRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const deletedIds = getDeletedPropertyIds();
        const customLocal = getCustomLocalProperties();
        const firestorePropsMap = new Map<string, Property>();
        const firestoreRefCodes = new Set<string>();

        snapshot.docs.forEach((docSnap) => {
          const prop = mapDocToProperty(docSnap.id, docSnap.data());
          firestorePropsMap.set(prop.id, prop);
          if (prop.refCode) firestoreRefCodes.add(prop.refCode);
        });

        // Auto-sync local custom properties to Firestore if rules now allow and they are not in Firestore yet
        customLocal.forEach((customProp) => {
          if (!firestorePropsMap.has(customProp.id) && db) {
            const docRef = doc(db, PROPERTIES_COLLECTION, customProp.id);
            setDoc(docRef, {
              ...customProp,
              updatedAt: Timestamp.now(),
            }).catch((e) => console.warn('Auto-sync local property notice:', e));
          }
        });

        const mergedProps: Property[] = [];
        const addedIds = new Set<string>();
        const addedRefCodes = new Set<string>();

        // 1. Add custom local properties first so user-uploaded properties are always visible at the top
        customLocal.forEach((customProp) => {
          if (!deletedIds.includes(customProp.id)) {
            mergedProps.push(customProp);
            addedIds.add(customProp.id);
            if (customProp.refCode) addedRefCodes.add(customProp.refCode);
          }
        });

        // 2. Add Firestore properties that were not deleted and not already added
        firestorePropsMap.forEach((prop, id) => {
          if (
            !deletedIds.includes(id) &&
            !addedIds.has(id) &&
            (!prop.refCode || !addedRefCodes.has(prop.refCode))
          ) {
            mergedProps.push(prop);
            addedIds.add(id);
            if (prop.refCode) addedRefCodes.add(prop.refCode);
          }
        });

        // 3. Add default catalog properties (PROPERTIES_DATA) if not deleted or already added
        PROPERTIES_DATA.forEach((sampleProp) => {
          if (
            !deletedIds.includes(sampleProp.id) &&
            !addedIds.has(sampleProp.id) &&
            (!sampleProp.refCode || !addedRefCodes.has(sampleProp.refCode))
          ) {
            mergedProps.push(sampleProp);
            addedIds.add(sampleProp.id);
            if (sampleProp.refCode) addedRefCodes.add(sampleProp.refCode);
          }
        });

        // 4. Sort properties to prevent random jumping
        mergedProps.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
          } else if (a.displayOrder !== undefined) {
            return -1;
          } else if (b.displayOrder !== undefined) {
            return 1;
          }

          if (a.isRecentlyUploaded && !b.isRecentlyUploaded) return -1;
          if (!a.isRecentlyUploaded && b.isRecentlyUploaded) return 1;
          
          const dateA = new Date(a.createdAt || '2000-01-01').getTime();
          const dateB = new Date(b.createdAt || '2000-01-01').getTime();
          if (dateA !== dateB) return dateB - dateA;
          
          return a.id.localeCompare(b.id);
        });

        onUpdate(mergedProps, !snapshot.empty);
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
        if (onError) onError(error);
        onUpdate(getCombinedLocalProperties(), false);
      }
    );
  } catch (err) {
    console.error('Error attaching listener to Firestore:', err);
    onUpdate(getCombinedLocalProperties(), false);
    return () => {};
  }
};

/**
 * Add a new property to Firestore (and fallback to localStorage).
 */
export const addPropertyToFirestore = async (propertyData: Omit<Property, 'id'>): Promise<string> => {
  let docId = `mef-${Date.now()}`;

  if (propertyData.featured) {
    const currentLocal = getCustomLocalProperties();
    const updatedLocal = currentLocal.map((p) => ({ ...p, featured: false }));
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));

    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
        for (const docSnap of querySnapshot.docs) {
          await updateDoc(doc(db, PROPERTIES_COLLECTION, docSnap.id), { featured: false });
        }
      } catch (e) {
        console.warn('Error clearing other featured properties in Firestore:', e);
      }
    }
  }

  if (db) {
    try {
      const propertiesRef = collection(db, PROPERTIES_COLLECTION);
      const cleanData = {
        ...propertyData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(propertiesRef, cleanData);
      docId = docRef.id;
    } catch (e) {
      console.warn('Firestore addDoc notice:', e);
    }
  }

  const fullProp: Property = { id: docId, ...propertyData };
  saveCustomLocalProperty(fullProp);
  return docId;
};

/**
 * Update an existing property in Firestore (and localStorage).
 */
export const updatePropertyInFirestore = async (id: string, propertyData: Partial<Property>) => {
  if (propertyData.featured) {
    const currentLocal = getCustomLocalProperties();
    const updatedLocal = currentLocal.map((p) => ({
      ...p,
      featured: p.id === id ? true : false,
    }));
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));

    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
        for (const docSnap of querySnapshot.docs) {
          if (docSnap.id !== id) {
            await updateDoc(doc(db, PROPERTIES_COLLECTION, docSnap.id), { featured: false });
          }
        }
      } catch (e) {
        console.warn('Error clearing other featured properties in Firestore on update:', e);
      }
    }
  }

  if (db) {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      const cleanData = {
        ...propertyData,
        updatedAt: Timestamp.now(),
      };
      await setDoc(docRef, cleanData, { merge: true });
    } catch (e) {
      console.warn('Firestore update notice:', e);
    }
  }

  const currentLocal = getCustomLocalProperties();
  const existing = currentLocal.find((p) => p.id === id);
  if (existing) {
    saveCustomLocalProperty({ ...existing, ...propertyData } as Property);
  }
};

/**
 * Delete a property from Firestore (and localStorage).
 */
export const deletePropertyFromFirestore = async (id: string) => {
  markPropertyAsDeletedLocal(id);
  removeCustomLocalProperty(id);
  if (!db) return;
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore deleteDoc notice:', e);
  }
};

export const seedSamplePropertiesToFirestore = async () => {};

export const updatePropertiesOrder = async (updates: { id: string; displayOrder: number }[]) => {
  // Update local storage too so local custom properties retain their order
  const customLocal = getCustomLocalProperties();
  let localUpdated = false;
  
  updates.forEach(update => {
    const localProp = customLocal.find(p => p.id === update.id);
    if (localProp) {
      localProp.displayOrder = update.displayOrder;
      localUpdated = true;
    }
  });

  if (localUpdated) {
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(customLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  }

  if (!db) return;
  try {
    const promises = updates.map(update => {
      const docRef = doc(db, PROPERTIES_COLLECTION, update.id);
      return updateDoc(docRef, { displayOrder: update.displayOrder, updatedAt: Timestamp.now() }).catch(e => {
         // Silently ignore NOT_FOUND errors for local-only mock properties
         if (e.code !== 'not-found') {
            console.warn(`Failed to update displayOrder for ${update.id}:`, e);
         }
      });
    });
    await Promise.all(promises);
  } catch (e) {
    console.warn('Error updating properties order:', e);
  }
};

/**
 * Export all properties (custom + catalog) as a JSON backup file.
 */
export const exportPropertiesBackupJSON = (propertiesList: Property[]) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(propertiesList, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mef_propiedades_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Import properties from a JSON string or array, saving them locally and to Firestore.
 */
export const importPropertiesBackupJSON = async (rawJSON: string): Promise<number> => {
  const parsed = JSON.parse(rawJSON);
  const items: Property[] = Array.isArray(parsed) ? parsed : [parsed];
  
  if (items.length === 0) return 0;

  // Clear local deleted list so imported items show up
  localStorage.removeItem(DELETED_PROPERTIES_KEY);
  window.dispatchEvent(new Event('mef_local_properties_updated'));

  let count = 0;
  for (const item of items) {
    if (item && item.title) {
      const propToSave: Property = {
        ...item,
        id: item.id || `mef-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      };
      saveCustomLocalProperty(propToSave);

      if (db) {
        try {
          const docRef = doc(db, PROPERTIES_COLLECTION, propToSave.id);
          await setDoc(docRef, {
            ...propToSave,
            updatedAt: Timestamp.now(),
          }, { merge: true });
        } catch (e) {
          console.warn('Firestore sync warning during import:', e);
        }
      }
      count++;
    }
  }

  return count;
};


