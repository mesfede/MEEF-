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
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Property } from '../types';
import { parseSafeDate } from '../lib/utils';

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
    if (!raw) return [];
    
    let properties: Property[] = JSON.parse(raw);
    
    // Filter out old example properties (which had short IDs like '1', '2', '3')
    const originalLength = properties.length;
    properties = properties.filter(p => p.id && p.id.toString().length > 5);
    
    // If we removed some, update local storage immediately
    if (properties.length < originalLength) {
      localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(properties));
    }
    
    return properties;
  } catch {
    return [];
  }
};

export const saveCustomLocalProperty = (property: Property) => {
  try {
    const current = getCustomLocalProperties();
    const cleanProp: Property = {
      ...property,
      statusBanner: property.statusBanner && property.statusBanner !== 'NINGUNA' ? property.statusBanner : undefined,
    };
    const idx = current.findIndex((p) => p.id === cleanProp.id || (p.refCode && p.refCode === cleanProp.refCode));
    if (idx >= 0) {
      current[idx] = cleanProp;
    } else {
      current.unshift(cleanProp);
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
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : undefined,
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
    images: Array.isArray(data.images) ? data.images : [],
    featured: Boolean(data.featured),
    isNewDevelopment: Boolean(data.isNewDevelopment),
    isRecentlyUploaded: Boolean(data.isRecentlyUploaded),
    statusBanner: data.statusBanner && data.statusBanner !== 'NINGUNA' ? data.statusBanner : undefined,
    videoUrl: data.videoUrl || '',
    videoType: data.videoType || (data.videoUrl?.includes('youtube') ? 'youtube' : 'mp4'),
    instagramUrl: data.instagramUrl || '',
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    lotFeatures: data.lotFeatures || undefined,
    agent: {
      name: data.agent?.name || 'María Eugenia Fernández',
      phone: data.agent?.phone || '+54 9 2284 603168',
      email: data.agent?.email || 'contacto@mefnegociosinmobiliarios.ar',
      avatar: data.agent?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: data.createdAt || new Date().toISOString().split('T')[0],
  };
};

export const getCombinedLocalProperties = (): Property[] => {
  const deletedIds = getDeletedPropertyIds();
  const customLocal = getCustomLocalProperties();

  const customFiltered = customLocal.filter((p) => !deletedIds.includes(p.id));
  const customIds = new Set(customFiltered.map((p) => p.id));
  const customRefCodes = new Set(customFiltered.map((p) => p.refCode).filter(Boolean));

  const list: Property[] = [...customFiltered];

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
    
    const dateA = parseSafeDate(a.createdAt || '2000-01-01');
    const dateB = parseSafeDate(b.createdAt || '2000-01-01');
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
        const isFromFirebase = !snapshot.metadata.fromCache;

        if (snapshot.empty) {
          console.log('Firestore collection is empty. Auto-syncing custom local properties...');
          const customLocal = getCustomLocalProperties();
          
          customLocal.forEach((prop) => {
            const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
            setDoc(docRef, {
              ...prop,
              updatedAt: Timestamp.now(),
            }).catch((e) => console.warn('Error auto-seeding property to Firestore:', e));
          });

          // Deliver local custom properties while Firestore populates
          onUpdate(customLocal, isFromFirebase);
          return;
        }

        const firestorePropsMap = new Map<string, Property>();
        const freshFirestoreProperties: Property[] = [];
        snapshot.docs.forEach((docSnap) => {
          const prop = mapDocToProperty(docSnap.id, docSnap.data());
          firestorePropsMap.set(prop.id, prop);
          freshFirestoreProperties.push(prop);
        });

        // Sync Firestore updates into localStorage so local cache never stays stale
        try {
          const currentLocal = getCustomLocalProperties();
          const localMap = new Map<string, Property>();
          currentLocal.forEach((p) => localMap.set(p.id, p));

          // Override local map with fresh Firestore data
          freshFirestoreProperties.forEach((fsProp) => {
            localMap.set(fsProp.id, fsProp);
          });

          const syncedLocalList = Array.from(localMap.values());
          localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(syncedLocalList));
        } catch (e) {
          console.warn('Error syncing Firestore to localStorage cache:', e);
        }

        // Add local custom properties if they aren't in Firestore yet
        const customLocal = getCustomLocalProperties();
        customLocal.forEach((customProp) => {
          if (!firestorePropsMap.has(customProp.id)) {
            firestorePropsMap.set(customProp.id, customProp);
            
            // Try to auto-sync it to Firestore since it's missing
            const docRef = doc(db, PROPERTIES_COLLECTION, customProp.id);
            setDoc(docRef, {
              ...customProp,
              updatedAt: Timestamp.now(),
            }).catch((e) => console.warn('Auto-sync local property notice:', e));
          }
        });

        const firestoreList: Property[] = Array.from(firestorePropsMap.values());

        firestoreList.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
          } else if (a.displayOrder !== undefined) {
            return -1;
          } else if (b.displayOrder !== undefined) {
            return 1;
          }

          if (a.isRecentlyUploaded && !b.isRecentlyUploaded) return -1;
          if (!a.isRecentlyUploaded && b.isRecentlyUploaded) return 1;
          
          const dateA = parseSafeDate(a.createdAt || '2000-01-01');
          const dateB = parseSafeDate(b.createdAt || '2000-01-01');
          if (dateA !== dateB) return dateB - dateA;
          
          return a.id.localeCompare(b.id);
        });

        onUpdate(firestoreList, isFromFirebase);
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

// Helper to remove undefined fields for Firestore compatibility
const removeUndefinedValues = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues);
  }
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      cleaned[key] = removeUndefinedValues(val);
    }
  }
  return cleaned;
};

/**
 * Add a new property to Firestore (and fallback to localStorage).
 */
export const addPropertyToFirestore = async (propertyData: Omit<Property, 'id'>, existingProperties?: Property[]): Promise<string> => {
  let docId = `mef-${Date.now()}`;

  // Find the minimum displayOrder among existing properties to make this one appear at the top
  let minDisplayOrder = 1;
  let hasFoundDisplayOrder = false;
  
  if (existingProperties && existingProperties.length > 0) {
    existingProperties.forEach((p) => {
      if (p.displayOrder !== undefined) {
        if (!hasFoundDisplayOrder || p.displayOrder < minDisplayOrder) {
          minDisplayOrder = p.displayOrder;
          hasFoundDisplayOrder = true;
        }
      }
    });
  }

  // If we didn't have existingProperties or none had displayOrder, check local custom properties
  if (!hasFoundDisplayOrder) {
    const localProps = getCustomLocalProperties();
    localProps.forEach((p) => {
      if (p.displayOrder !== undefined) {
        if (!hasFoundDisplayOrder || p.displayOrder < minDisplayOrder) {
          minDisplayOrder = p.displayOrder;
          hasFoundDisplayOrder = true;
        }
      }
    });
  }

  if (db && !hasFoundDisplayOrder) {
    try {
      const q = query(
        collection(db, PROPERTIES_COLLECTION),
        orderBy('displayOrder', 'asc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0].data();
        if (firstDoc.displayOrder !== undefined) {
          minDisplayOrder = firstDoc.displayOrder;
          hasFoundDisplayOrder = true;
        }
      }
    } catch (e) {
      console.warn('Error getting min displayOrder from Firestore:', e);
    }
  }

  // If no display order exists anywhere, default the new one to 1.
  // Otherwise, set it to minDisplayOrder - 1 so it is strictly smaller than the minimum, pushing it to the very top.
  const newDisplayOrder = hasFoundDisplayOrder ? minDisplayOrder - 1 : 1;

  if (propertyData.featured) {
    const currentLocal = getCustomLocalProperties();
    const updatedLocal = currentLocal.map((p) => ({ ...p, featured: false }));
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));

    if (db) {
      getDocs(collection(db, PROPERTIES_COLLECTION)).then(querySnapshot => {
        querySnapshot.docs.forEach(docSnap => {
          updateDoc(doc(db, PROPERTIES_COLLECTION, docSnap.id), { featured: false }).catch(() => {});
        });
      }).catch(e => console.warn('Error clearing other featured properties in Firestore:', e));
    }
  }

  const fullProp: Property = { 
    id: docId, 
    ...propertyData, 
    displayOrder: propertyData.displayOrder !== undefined ? propertyData.displayOrder : newDisplayOrder 
  };
  saveCustomLocalProperty(fullProp);

  if (db) {
    const cleanData = removeUndefinedValues({
      ...propertyData,
      displayOrder: propertyData.displayOrder !== undefined ? propertyData.displayOrder : newDisplayOrder,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: Timestamp.now(),
    });
    // Don't wait for addDoc, it might hang if db is unconfigured
    setDoc(doc(db, PROPERTIES_COLLECTION, docId), cleanData).catch(e => {
      console.warn('Firestore addDoc notice:', e);
    });
  }

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
      getDocs(collection(db, PROPERTIES_COLLECTION)).then(querySnapshot => {
        querySnapshot.docs.forEach(docSnap => {
          if (docSnap.id !== id) {
             updateDoc(doc(db, PROPERTIES_COLLECTION, docSnap.id), { featured: false }).catch(() => {});
          }
        });
      }).catch(e => console.warn('Error clearing other featured properties in Firestore on update:', e));
    }
  }

  const currentLocal = getCustomLocalProperties();
  const existing = currentLocal.find((p) => p.id === id);
  if (existing) {
    saveCustomLocalProperty({ ...existing, ...propertyData } as Property);
  }

  if (db) {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const cleanData = removeUndefinedValues({
      ...propertyData,
      updatedAt: Timestamp.now(),
    });
    setDoc(docRef, cleanData, { merge: true }).catch(e => {
      console.warn('Firestore update notice:', e);
    });
  }
};

/**
 * Delete a property from Firestore (and localStorage).
 */
export const deletePropertyFromFirestore = async (id: string) => {
  markPropertyAsDeletedLocal(id);
  removeCustomLocalProperty(id);
  if (db) {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    deleteDoc(docRef).catch(e => {
      console.warn('Firestore deleteDoc notice:', e);
    });
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
      return setDoc(docRef, { displayOrder: update.displayOrder, updatedAt: Timestamp.now() }, { merge: true }).catch(e => {
        console.warn(`Failed to update displayOrder for ${update.id}:`, e);
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
  const firestorePromises: Promise<void>[] = [];

  for (const item of items) {
    if (item && item.title) {
      const propToSave: Property = {
        ...item,
        id: item.id || `mef-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      };
      saveCustomLocalProperty(propToSave);

      if (db) {
        const docRef = doc(db, PROPERTIES_COLLECTION, propToSave.id);
        const p = setDoc(docRef, {
          ...propToSave,
          updatedAt: Timestamp.now(),
        }, { merge: true }).catch((e) => {
          console.warn('Firestore sync warning during import:', e);
        });
        firestorePromises.push(p);
      }
      count++;
    }
  }

  // We do not await firestorePromises here because if Firestore is misconfigured
  // or offline, it could hang and prevent the UI from showing the local success alert.
  
  return count;
};

/**
 * Explicitly sync all local properties directly into Firebase Firestore.
 */
export const syncAllLocalToFirestore = async (): Promise<number> => {
  const localProps = getCustomLocalProperties();
  if (localProps.length === 0) return 0;
  
  if (!db) {
    throw new Error('Firebase no está inicializado.');
  }

  let count = 0;
  for (const prop of localProps) {
    const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
    const writePromise = setDoc(docRef, {
      ...prop,
      updatedAt: Timestamp.now(),
    }, { merge: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('No se pudo conectar con Firebase. La base de datos no está activa aún.')), 5000)
    );

    await Promise.race([writePromise, timeoutPromise]);
    count++;
  }
  return count;
};


