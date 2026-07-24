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
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Property } from '../types';
import { PROPERTIES_DATA } from '../data/properties';

const PROPERTIES_COLLECTION = 'properties';
const DELETED_PROPERTIES_KEY = 'mef_deleted_property_ids';

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
    }
  } catch (e) {
    console.warn('Error marking property as deleted locally:', e);
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

/**
 * Subscribe to realtime properties list from Firestore.
 * Merges Firestore documents with sample catalog properties without losing un-edited properties.
 */
export const subscribeToProperties = (
  onUpdate: (properties: Property[], isFromFirebase: boolean) => void,
  onError?: (err: any) => void
) => {
  try {
    if (!db) {
      const deletedIds = getDeletedPropertyIds();
      const filteredSample = PROPERTIES_DATA.filter((p) => !deletedIds.includes(p.id));
      onUpdate(filteredSample, false);
      return () => {};
    }

    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const q = query(propertiesRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const deletedIds = getDeletedPropertyIds();
        const firestorePropsMap = new Map<string, Property>();
        const firestoreRefCodes = new Set<string>();

        snapshot.docs.forEach((docSnap) => {
          const prop = mapDocToProperty(docSnap.id, docSnap.data());
          firestorePropsMap.set(prop.id, prop);
          if (prop.refCode) firestoreRefCodes.add(prop.refCode);
        });

        const mergedProps: Property[] = [];

        // 1. Add valid Firestore properties that were not deleted
        firestorePropsMap.forEach((prop, id) => {
          if (!deletedIds.includes(id)) {
            mergedProps.push(prop);
          }
        });

        // 2. Preserve sample properties if they haven't been edited/overridden in Firestore and haven't been deleted
        PROPERTIES_DATA.forEach((sampleProp) => {
          if (
            !deletedIds.includes(sampleProp.id) &&
            !firestorePropsMap.has(sampleProp.id) &&
            !firestoreRefCodes.has(sampleProp.refCode)
          ) {
            mergedProps.push(sampleProp);
          }
        });

        onUpdate(mergedProps, !snapshot.empty);
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
        if (onError) onError(error);
        const deletedIds = getDeletedPropertyIds();
        const filteredSample = PROPERTIES_DATA.filter((p) => !deletedIds.includes(p.id));
        onUpdate(filteredSample, false);
      }
    );
  } catch (err) {
    console.error('Error attaching listener to Firestore:', err);
    const deletedIds = getDeletedPropertyIds();
    const filteredSample = PROPERTIES_DATA.filter((p) => !deletedIds.includes(p.id));
    onUpdate(filteredSample, false);
    return () => {};
  }
};

/**
 * Add a new property to Firestore.
 */
export const addPropertyToFirestore = async (propertyData: Omit<Property, 'id'>) => {
  if (!db) throw new Error('Base de datos no disponible');
  const propertiesRef = collection(db, PROPERTIES_COLLECTION);
  const cleanData = {
    ...propertyData,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(propertiesRef, cleanData);
  return docRef.id;
};

/**
 * Update an existing property in Firestore.
 */
export const updatePropertyInFirestore = async (id: string, propertyData: Partial<Property>) => {
  if (!db) throw new Error('Base de datos no disponible');
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const cleanData = {
    ...propertyData,
    updatedAt: Timestamp.now(),
  };
  await setDoc(docRef, cleanData, { merge: true });
};

/**
 * Delete a property from Firestore.
 */
export const deletePropertyFromFirestore = async (id: string) => {
  markPropertyAsDeletedLocal(id);
  if (!db) return;
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Seed sample initial properties into Firestore with 1 click.
 */
export const seedSamplePropertiesToFirestore = async () => {
  if (!db) throw new Error('Base de datos no disponible');
  for (const item of PROPERTIES_DATA) {
    const docRef = doc(db, PROPERTIES_COLLECTION, item.id);
    await setDoc(docRef, {
      ...item,
      updatedAt: Timestamp.now(),
    });
  }
};
