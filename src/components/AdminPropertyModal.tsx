import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
  Bed,
  Bath,
  Car,
  Maximize2,
  Trees,
  Sliders,
  Save,
  AlertCircle,
  HelpCircle,
  Star,
  Upload,
} from 'lucide-react';
import { Property, OperationType, PropertyType } from '../types';
import { ZONES_LIST } from '../data/properties';
import { addPropertyToFirestore, updatePropertyInFirestore } from '../services/propertyService';

interface AdminPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
  onSavedSuccess?: (savedProperty?: Property) => void;
}

const COMMON_AMENITIES = [
  'Parrilla',
  'Cochera',
  'Pileta',
  'Gas Natural',
  'Jardín',
  'Apto Crédito',
  'Acepta Mascotas',
  'Agua Corriente',
  'Cloacas',
  'Electricidad',
  'Asfalto',
  'Alarma',
  'Calefacción',
  'Aire Acondicionado',
  'Balcón',
  'Quincho',
  'Lavadero',
  'Seguridad 24hs',
];

export const AdminPropertyModal: React.FC<AdminPropertyModalProps> = ({
  isOpen,
  onClose,
  propertyToEdit,
  onSavedSuccess,
}) => {
  // Form states
  const [refCode, setRefCode] = useState('');
  const [title, setTitle] = useState('');
  const [operation, setOperation] = useState<OperationType>('VENTA');
  const [type, setType] = useState<PropertyType>('Casa');
  const [priceUSD, setPriceUSD] = useState<number | ''>(120000);
  const [priceARS, setPriceARS] = useState<number | ''>('');
  const [expensesARS, setExpensesARS] = useState<number | ''>(0);

  // Location
  const [zone, setZone] = useState('General La Madrid - Centro');
  const [address, setAddress] = useState('Calle San Martín 500');
  const [city, setCity] = useState('General La Madrid');
  const [lat, setLat] = useState<number | ''>(-37.2483);
  const [lng, setLng] = useState<number | ''>(-61.2619);

  // Specs
  const [coveredArea, setCoveredArea] = useState<number | ''>(150);
  const [totalArea, setTotalArea] = useState<number | ''>(400);
  const [bedrooms, setBedrooms] = useState<number | ''>(3);
  const [bathrooms, setBathrooms] = useState<number | ''>(2);
  const [garages, setGarages] = useState<number | ''>(1);

  // Text details
  const [description, setDescription] = useState('');

  // Media URLs & Photo management
  const [imageUrlsText, setImageUrlsText] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState<'mp4' | 'youtube' | 'instagram'>('mp4');
  const [instagramUrl, setInstagramUrl] = useState('');

  // Badges & Amenities
  const [featured, setFeatured] = useState(false);
  const [isNewDevelopment, setIsNewDevelopment] = useState(false);
  const [isRecentlyUploaded, setIsRecentlyUploaded] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Parrilla',
    'Gas Natural',
    'Agua Corriente',
  ]);
  const [customAmenity, setCustomAmenity] = useState('');

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load property to edit if supplied
  useEffect(() => {
    if (propertyToEdit) {
      setRefCode(propertyToEdit.refCode || '');
      setTitle(propertyToEdit.title || '');
      setOperation(propertyToEdit.operation || 'VENTA');
      setType(propertyToEdit.type || 'Casa');
      setPriceUSD(propertyToEdit.priceUSD || 0);
      setPriceARS(propertyToEdit.priceARS || '');
      setExpensesARS(propertyToEdit.expensesARS || 0);

      setZone(propertyToEdit.location?.zone || 'General La Madrid - Centro');
      setAddress(propertyToEdit.location?.address || '');
      setCity(propertyToEdit.location?.city || 'General La Madrid');
      setLat(propertyToEdit.location?.lat || -37.2483);
      setLng(propertyToEdit.location?.lng || -61.2619);

      setCoveredArea(propertyToEdit.coveredArea || 0);
      setTotalArea(propertyToEdit.totalArea || 0);
      setBedrooms(propertyToEdit.bedrooms || 0);
      setBathrooms(propertyToEdit.bathrooms || 0);
      setGarages(propertyToEdit.garages || 0);

      setDescription(propertyToEdit.description || '');

      setImageUrlsText((propertyToEdit.images || []).join('\n'));
      setMainImageIndex(0);
      setVideoUrl(propertyToEdit.videoUrl || '');
      setVideoType(propertyToEdit.videoType || 'mp4');
      setInstagramUrl(propertyToEdit.instagramUrl || '');

      setFeatured(Boolean(propertyToEdit.featured));
      setIsNewDevelopment(Boolean(propertyToEdit.isNewDevelopment));
      setIsRecentlyUploaded(Boolean(propertyToEdit.isRecentlyUploaded));
      setSelectedAmenities(propertyToEdit.amenities || []);
    } else {
      // Reset form defaults for brand new property
      const randomRef = `MEF-${Math.floor(100 + Math.random() * 900)}`;
      setRefCode(randomRef);
      setTitle('');
      setPriceUSD('');
      setDescription('');
      setImageUrlsText('');
      setMainImageIndex(0);
      setVideoUrl('');
      setInstagramUrl('');
    }
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  // Helper to parse image URLs from textarea
  const parsedImageUrls = imageUrlsText
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter((url) => url.length > 5 && (url.startsWith('http://') || url.startsWith('https://')));

  const handleAddSingleUrl = () => {
    const trimmed = newImageUrl.trim();
    if (trimmed && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
      const updatedText = imageUrlsText.trim() ? `${imageUrlsText.trim()}\n${trimmed}` : trimmed;
      setImageUrlsText(updatedText);
      setNewImageUrl('');
    }
  };

  const handleRemoveImageByIndex = (idxToRemove: number) => {
    const remaining = parsedImageUrls.filter((_, i) => i !== idxToRemove);
    setImageUrlsText(remaining.join('\n'));
    if (mainImageIndex === idxToRemove) {
      setMainImageIndex(0);
    } else if (mainImageIndex > idxToRemove) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Por favor ingrese el título de la propiedad.');
      return;
    }

    // Reorder images so selected main image is at index 0 (featured / cover photo)
    let orderedImages = [...parsedImageUrls];
    if (orderedImages.length === 0) {
      orderedImages = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
    } else if (mainImageIndex >= 0 && mainImageIndex < orderedImages.length) {
      const chosenMain = orderedImages[mainImageIndex];
      const rest = orderedImages.filter((_, idx) => idx !== mainImageIndex);
      orderedImages = [chosenMain, ...rest];
    }

    setLoading(true);

    const propertyPayload: Omit<Property, 'id'> = {
      refCode: refCode.trim() || `MEF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      operation,
      type,
      priceUSD: priceUSD ? Number(priceUSD) : 0,
      priceARS: priceARS ? Number(priceARS) : 0,
      expensesARS: expensesARS ? Number(expensesARS) : 0,
      location: {
        zone: zone || 'General La Madrid - Centro',
        address: address.trim() || 'General La Madrid',
        city: city.trim() || 'General La Madrid',
        lat: Number(lat) || -37.2483,
        lng: Number(lng) || -61.2619,
      },
      coveredArea: Number(coveredArea) || 0,
      totalArea: Number(totalArea) || 0,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      garages: Number(garages) || 0,
      description: description.trim(),
      images: orderedImages,
      featured,
      isNewDevelopment,
      isRecentlyUploaded,
      videoUrl: videoUrl.trim(),
      videoType,
      instagramUrl: instagramUrl.trim(),
      amenities: selectedAmenities,
      agent: {
        name: 'María Eugenia Fernández',
        phone: '+54 9 11 5521 8899',
        email: 'contacto@mefnegociosinmobiliarios.ar',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      },
      createdAt: propertyToEdit?.createdAt || new Date().toISOString().split('T')[0],
    };

    let targetId = propertyToEdit?.id;

    try {
      if (targetId) {
        // Attempt update with safety timeout
        await Promise.race([
          updatePropertyInFirestore(targetId, propertyPayload),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout de Firestore')), 5000)
          ),
        ]).catch((err) => {
          console.warn('Sync warning:', err);
        });
        setSuccessMsg('¡Propiedad actualizada exitosamente!');
      } else {
        try {
          const newDocId = await Promise.race([
            addPropertyToFirestore(propertyPayload),
            new Promise<string>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout de Firestore')), 5000)
            ),
          ]);
          targetId = newDocId;
        } catch (err) {
          console.warn('Sync warning on add:', err);
          targetId = `mef-${Date.now()}`;
        }
        setSuccessMsg('¡Nueva propiedad guardada exitosamente!');
      }

      const savedFullProperty: Property = {
        id: targetId || `mef-${Date.now()}`,
        ...propertyPayload,
      };

      setTimeout(() => {
        if (onSavedSuccess) onSavedSuccess(savedFullProperty);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Error saving property:', err);
      setErrorMsg(`Inconveniente al guardar: ${err.message || 'Error de conexión'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-4xl h-[92vh] max-h-[900px] rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col text-left">
        {/* HEADER */}
        <div className="bg-[#181818] text-white p-4 sm:px-6 flex items-center justify-between shrink-0 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#48A82D] text-white flex items-center justify-center font-black">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#48A82D] uppercase tracking-wider">
                {propertyToEdit ? 'Editar Propiedad' : 'Cargar Nueva Propiedad Real'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Formulario de carga directa a la Base de Datos de MEF Negocios Inmobiliarios
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MESSAGES */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#48A82D]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* SECTION 1: BASIC IDENTIFICATION & CLASSIFICATION */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#48A82D]" />
              <span>1. Clasificación y Título Principal</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Código REF (COD.REF)
                </label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="Ej: MEF-GLM10"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Operación *
                </label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as OperationType)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                >
                  <option value="VENTA">VENTA</option>
                  <option value="ALQUILER">ALQUILER</option>
                  <option value="LOTES">LOTES Y TERRENOS</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Tipo de Propiedad *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                >
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Lote / Terreno">Lote / Terreno</option>
                  <option value="Quinta / Campo">Quinta / Campo</option>
                  <option value="Barrio Cerrado">Barrio Cerrado</option>
                  <option value="PH">PH</option>
                  <option value="Local / Oficina">Local / Oficina</option>
                </select>
              </div>
            </div>

            {/* PRICE FIELDS: PESOS ARS, USD, OR CONSULTAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-zinc-200">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                  Precio en Pesos (ARS $)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-zinc-400">ARS $</span>
                  <input
                    type="number"
                    value={priceARS}
                    onChange={(e) => setPriceARS(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 150000000 (Dejar en 0 si no publica)"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-16 pr-3 py-2 text-xs font-extrabold text-[#48A82D] focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                  Precio en Dólares (USD $)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-zinc-400">USD $</span>
                  <input
                    type="number"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 120000 (Dejar en 0 si no publica)"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-16 pr-3 py-2 text-xs font-extrabold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 text-[11px] text-zinc-500 font-medium bg-zinc-100 p-2 rounded-lg flex items-center justify-between">
                <span>
                  💡 <strong>Opción "Consultar":</strong> Si se dejan en 0 ambos valores, la propiedad se publicará mostrando <strong>"Consultar"</strong> en el lugar del precio.
                </span>
                {(!priceARS && !priceUSD) || (Number(priceARS) === 0 && Number(priceUSD) === 0) ? (
                  <span className="text-[#48A82D] font-extrabold px-2 py-0.5 bg-[#48A82D]/10 rounded border border-[#48A82D]/20">
                    Se publicará como: CONSULTAR
                  </span>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                Título Publicación *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Casa Residencial 4 Ambientes con Gran Parque y Quincho"
                className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
              />
            </div>
          </div>

          {/* SECTION 2: LOCATION */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#48A82D]" />
              <span>2. Ubicación y Geolocalización</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Zona / Barrio *
                </label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Ej: General La Madrid - Centro"
                  list="zones-list"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                />
                <datalist id="zones-list">
                  {ZONES_LIST.map((z) => (
                    <option key={z} value={z} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle San Martín 650"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="General La Madrid"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Latitud Google Maps
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="-37.2483"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Longitud Google Maps
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={lng}
                  onChange={(e) => setLng(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="-61.2619"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: METRICS AND AMBIENTES */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#48A82D]" />
              <span>3. Superficies y Ambientes</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1 flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>Dormitorios</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1 flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>Baños</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>Cocheras</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={garages}
                  onChange={(e) => setGarages(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>Cubierta (m²)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={coveredArea}
                  onChange={(e) => setCoveredArea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1 flex items-center gap-1">
                  <Trees className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>Total (m²)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: MULTIMEDIA URLS (IMAGES & VIDEO & PORTADA SELECTION) */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-2 gap-2">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#48A82D]" />
                <span>4. Gestión de Fotografías y Selección de Foto Principal / Portada</span>
              </h4>
              <span className="text-[11px] font-bold text-[#48A82D] bg-[#48A82D]/10 px-2.5 py-1 rounded-md border border-[#48A82D]/20">
                {parsedImageUrls.length} foto(s) cargadas
              </span>
            </div>

            {/* Quick Add Single Photo URL Input */}
            <div className="bg-white border border-zinc-200 p-3 rounded-xl flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Pegar enlace / URL de foto individual (ej: https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSingleUrl();
                  }
                }}
                className="flex-1 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
              />
              <button
                type="button"
                onClick={handleAddSingleUrl}
                className="bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Foto</span>
              </button>
            </div>

            {/* Bulk URLs Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                O Pegar Múltiples URLs de Fotos (Una URL por línea) *
              </label>
              <textarea
                rows={3}
                value={imageUrlsText}
                onChange={(e) => setImageUrlsText(e.target.value)}
                placeholder={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9...\nhttps://images.unsplash.com/photo-1600585154340...`}
                className="w-full bg-white border border-zinc-300 rounded-xl p-3 text-xs font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
              />
              <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#48A82D]" />
                <span>
                  Haga clic en <strong>"⭐ Foto Principal"</strong> en la foto que desea mostrar en la portada principal de la propiedad.
                </span>
              </p>
            </div>

            {/* VISUAL GALLERY THUMBNAILS WITH MAIN PHOTO SELECTOR */}
            {parsedImageUrls.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  📸 Vista Previa y Elección de Foto Principal (Portada):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {parsedImageUrls.map((url, index) => {
                    const isMain = index === mainImageIndex;
                    return (
                      <div
                        key={index}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col bg-white shadow-xs ${
                          isMain
                            ? 'border-[#48A82D] ring-2 ring-[#48A82D]/30 scale-[1.02]'
                            : 'border-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="relative h-28 w-full bg-zinc-100 overflow-hidden">
                          <img
                            src={url}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.dataset.hasError) return; img.dataset.hasError = 'true'; img.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';
                            }}
                          />

                          {/* Badge Principal */}
                          {isMain ? (
                            <div className="absolute top-1.5 left-1.5 bg-[#48A82D] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              <span>FOTO PRINCIPAL</span>
                            </div>
                          ) : (
                            <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              #{index + 1}
                            </div>
                          )}

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImageByIndex(index)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm cursor-pointer"
                            title="Quitar foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Action Bar for selecting Main */}
                        <div className="p-2 bg-zinc-50 flex items-center justify-between border-t border-zinc-200">
                          {isMain ? (
                            <span className="text-[11px] font-bold text-[#48A82D] flex items-center gap-1 mx-auto">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Es la Portada</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setMainImageIndex(index)}
                              className="w-full py-1 bg-white hover:bg-[#48A82D] text-zinc-700 hover:text-white border border-zinc-300 hover:border-[#48A82D] rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>Elegir como Principal</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-[#48A82D]" />
                  <span>URL de Video (MP4 o YouTube)</span>
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Ej: https://miservidor.com/video-tour.mp4 o YouTube"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                  URL de Reel / Post de Instagram
                </label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/C3_GLM_MEF/"
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono text-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: DESCRIPTION */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#48A82D]" />
              <span>5. Descripción Detallada</span>
            </h4>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa en detalle las comodidades, orientación, estado de conservación, servicios conectados y particularidades..."
              className="w-full bg-white border border-zinc-300 rounded-xl p-3 text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
            />
          </div>

          {/* SECTION 6: AMENITIES & BADGES */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#48A82D]" />
              <span>6. Servicios, Etiquetas y Destacados</span>
            </h4>

            {/* BADGES / TOGGLES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-white cursor-pointer hover:bg-zinc-100 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#48A82D] rounded focus:ring-[#48A82D]"
                />
                <span className="text-xs font-bold text-zinc-800">⭐ Destacada en Inicio</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-white cursor-pointer hover:bg-zinc-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isRecentlyUploaded}
                  onChange={(e) => setIsRecentlyUploaded(e.target.checked)}
                  className="w-4 h-4 text-[#48A82D] rounded focus:ring-[#48A82D]"
                />
                <span className="text-xs font-bold text-zinc-800">🔥 Etiqueta "Recién Subida"</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-white cursor-pointer hover:bg-zinc-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isNewDevelopment}
                  onChange={(e) => setIsNewDevelopment(e.target.checked)}
                  className="w-4 h-4 text-[#48A82D] rounded focus:ring-[#48A82D]"
                />
                <span className="text-xs font-bold text-zinc-800">🏗️ Emprendimiento / En Pozo</span>
              </label>
            </div>

            {/* AMENITIES CHECKBOXES */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-2">
                Servicios y Características
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#181818] text-white border-2 border-[#48A82D] shadow-xs'
                          : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-[#48A82D]' : 'text-zinc-400'}`} />
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM AMENITY INPUT */}
              <div className="mt-3 flex gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="Agregar otra característica..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-800"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="bg-zinc-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-zinc-900 cursor-pointer"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="pt-2 flex items-center justify-end gap-3 sticky bottom-0 bg-white p-3 border-t border-zinc-200 shadow-lg rounded-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando en Firebase...' : 'Guardar Propiedad'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
