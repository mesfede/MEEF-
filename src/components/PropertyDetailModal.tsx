
const getInstagramEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  return null;
};
import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Maximize, Bed, Bath, Car, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight, Share2, Heart, Trees, Video, ExternalLink, Star, FileText, Plus, Minus, Home } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  currency: 'USD' | 'ARS';
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isAdmin?: boolean;
  onEditProperty?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currency,
  onClose,
  isFavorite,
  onToggleFavorite,
  isAdmin,
  onEditProperty,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'video' | 'amenities' | 'location'>(
    property?.videoUrl || property?.instagramUrl ? 'video' : 'info'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(15);

  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRef.current) {
      const activeEl = thumbnailRef.current.children[activeImageIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeImageIndex]);

  if (!property) return null;

  const currentPhotoUrl = property.images[activeImageIndex] || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayPrice = () => {
    if ((!property.priceARS || property.priceARS <= 0) && (!property.priceUSD || property.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (property.priceARS && property.priceARS > 0) {
      return `$ ${property.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (currency === 'USD' && property.priceUSD > 0) {
      return `USD $${property.priceUSD.toLocaleString('en-US')}`;
    }
    const calculatedARS = property.priceUSD ? property.priceUSD * 1350 : 0;
    if (calculatedARS > 0) {
      return `$ ${calculatedARS.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Google Maps location query
  const mapQuery = property.location.lat && property.location.lng
    ? `${property.location.lat},${property.location.lng}`
    : encodeURIComponent(`${property.location.address}, ${property.location.zone}, ${property.location.city}, Argentina`);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=${mapZoom}&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-5 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-zinc-200">
        {/* TOP MODAL HEADER */}
        <div className="bg-[#181818] text-white px-4 py-3 sm:px-5 flex items-center justify-between border-b border-[#48A82D] shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo-white.png" alt="Inmobiliaria" className="h-10 sm:h-12 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onEditProperty && (
              <button
                onClick={() => {
                  onEditProperty(property);
                  onClose();
                }}
                className="bg-[#48A82D] hover:bg-[#3C8F24] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Editar propiedad en Firebase"
              >
                <span>Editar Propiedad</span>
              </button>
            )}

            <button
              onClick={() => onToggleFavorite(property.id)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Guardar en favoritos"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#48A82D] text-[#48A82D]' : 'text-white'}`} />
            </button>

            <div className="relative">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Compartir enlace"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {copiedLink && (
                <div className="absolute top-full right-0 mt-1 bg-[#48A82D] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap z-50 animate-fadeIn">
                  ¡Enlace copiado!
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-4">
          {/* HERO SPLIT SECTION: PHOTOS (LEFT) + KEY DETAILS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* LEFT COLUMN: IMAGE GALLERY */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div
                onDoubleClick={() => setZoomImage(currentPhotoUrl)}
                className="relative aspect-4/3 sm:aspect-4/3 lg:aspect-4/3 min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] w-full rounded-2xl overflow-hidden bg-zinc-900 group shadow-md border border-zinc-200 cursor-zoom-in"
                title="Haga doble clic para ampliar a pantalla completa"
              >
                <img
                  src={currentPhotoUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
                  onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
                />

                {/* Subtle Logo Watermark Overlay */}
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-[0.4] z-10 w-16 h-16">
                  <img src="/logo-white.png" alt="" className="w-full h-full object-contain drop-shadow-md" />
                </div>

                {/* Double click instruction overlay badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize className="w-3 h-3 text-[#48A82D]" />
                  <span>Doble clic para ampliar</span>
                </div>

                {/* Operation & Featured Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-md ${
                    property.operation === 'VENTA'
                      ? 'bg-black text-white'
                      : property.operation === 'ALQUILER' || property.operation === 'ALQUILER TEMPORAL'
                      ? 'bg-zinc-700 text-white'
                      : 'bg-[#48A82D] text-white'
                  }`}>
                    {property.operation}
                  </span>
                  {property.featured && (
                    <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Home className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>Propiedad destacada</span>
                    </span>
                  )}
                </div>

                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(
                          (prev) => (prev - 1 + property.images.length) % property.images.length
                        );
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev + 1) % property.images.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {activeImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail selector strip with navigation arrows */}
              {property.images.length > 1 && (
                <div className="relative flex items-center gap-1.5 mt-2">
                  {property.images.length > 4 && (
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('left')}
                      className="p-2 rounded-xl bg-zinc-800 text-white hover:bg-black transition-colors shrink-0 cursor-pointer shadow-sm"
                      title="Fotos anteriores"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  <div
                    ref={thumbnailRef}
                    className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth flex-1"
                  >
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        onDoubleClick={() => setZoomImage(img)}
                        className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          idx === activeImageIndex
                            ? 'border-[#48A82D] scale-102 shadow-md ring-2 ring-[#48A82D]/20'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={`Foto ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>

                  {property.images.length > 4 && (
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('right')}
                      className="p-2 rounded-xl bg-zinc-800 text-white hover:bg-black transition-colors shrink-0 cursor-pointer shadow-sm"
                      title="Siguientes fotos"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ESSENTIAL INFO (TITLE, PRICE, SPECS & ACTIONS) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-200 gap-3">
              <div className="space-y-2.5">
                {/* Category & Zone */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#48A82D] uppercase tracking-wider">
                    <span>{property.type}</span>
                    <span className="text-zinc-400 font-normal">/</span>
                    <span>{property.location.zone}</span>
                  </div>
                </div>

                {/* Main Title */}
                <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 leading-snug">
                  {property.title}
                </h2>

                {/* Address */}
                <p className="text-xs text-zinc-600 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#48A82D] shrink-0" />
                  <span>
                    {property.location.address}, {property.location.zone}, {property.location.city}
                  </span>
                </p>

                {/* Price Display */}
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block tracking-wider">
                    Precio
                  </span>
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <span className={`text-xl sm:text-2xl font-black ${displayPrice() === 'Consultar' ? 'text-[#48A82D]' : 'text-zinc-900'}`}>
                      {displayPrice()}
                    </span>
                  </div>
                  {Boolean(property.expensesARS && property.expensesARS > 0) && (
                    <span className="text-[11px] text-zinc-500 block font-medium mt-0.5">
                      + Expensas: ${property.expensesARS?.toLocaleString()} ARS
                    </span>
                  )}
                </div>

                {/* 2x2 SPECS GRID */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-zinc-200 flex items-center gap-2">
                    <div className="p-1.5 bg-[#48A82D]/10 text-[#48A82D] rounded-lg">
                      <Maximize className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase block">Superficie</span>
                      <span className="text-xs font-bold text-zinc-800">{property.coveredArea} m² cub.</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-zinc-200 flex items-center gap-2">
                    <div className="p-1.5 bg-[#48A82D]/10 text-[#48A82D] rounded-lg">
                      <Bed className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase block">Dormitorios</span>
                      <span className="text-xs font-bold text-zinc-800">
                        {property.bedrooms > 0 ? `${property.bedrooms} dorm.` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-zinc-200 flex items-center gap-2">
                    <div className="p-1.5 bg-[#48A82D]/10 text-[#48A82D] rounded-lg">
                      <Bath className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase block">Baños</span>
                      <span className="text-xs font-bold text-zinc-800">
                        {property.bathrooms > 0 ? `${property.bathrooms} baños` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-zinc-200 flex items-center gap-2">
                    <div className="p-1.5 bg-[#48A82D]/10 text-[#48A82D] rounded-lg">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase block">Cocheras</span>
                      <span className="text-xs font-bold text-zinc-800">
                        {property.garages > 0 ? `${property.garages} coch.` : 'Sin coch.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION BUTTON */}
              <div className="space-y-1.5 pt-1 border-t border-zinc-200">
                <a
                  href={`https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#48A82D] hover:bg-[#3C8F24] text-white py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="border-b border-zinc-200 flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'info'
                  ? 'border-[#48A82D] text-[#48A82D]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Descripción
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'border-[#48A82D] text-[#48A82D]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Video className="w-4 h-4 text-rose-500" />
              <span>Video Tour / IG</span>
              {(property.videoUrl || property.instagramUrl) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'amenities'
                  ? 'border-[#48A82D] text-[#48A82D]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Amenities
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'location'
                  ? 'border-[#48A82D] text-[#48A82D]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Ubicación
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-600" />
                    <span>Video Tour de la Propiedad</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Recorrido audiovisual publicado por MARIA EUGENIA FERNÁNDEZ Inmobiliaria
                  </p>
                </div>

                {property.instagramUrl && (
                  <a
                    href={property.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <span>Ver Reel en Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {(() => {
                const videoOrIgUrl = property.instagramUrl || property.videoUrl;
                const igEmbedUrl = getInstagramEmbedUrl(videoOrIgUrl);

                if (igEmbedUrl) {
                  return (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="relative w-full max-w-[380px] h-[580px] sm:h-[620px] rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex items-center justify-center mx-auto">
                        <iframe
                          src={igEmbedUrl}
                          className="w-full h-full border-0 rounded-2xl"
                          scrolling="no"
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          title="Instagram Reel / Video"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-2 text-center">
                        Visualización en formato vertical de Instagram. Si tenés problemas para reproducir, usá el botón "Ver Reel en Instagram".
                      </p>
                    </div>
                  );
                }

                if (property.videoUrl) {
                  return (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/9 shadow-lg border border-zinc-800">
                      <video
                        src={property.videoUrl}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-contain"
                      />
                    </div>
                  );
                }

                return null;
              })() || (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-3">
                  <Video className="w-10 h-10 text-zinc-400 mx-auto" />
                  <h4 className="font-bold text-zinc-800 text-sm">Video individual en edición</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Podés solicitar el video completo del recorrido directo a nuestro WhatsApp o ver nuestros Reels actualizados en Instagram.
                  </p>
                  <a
                    href={`https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quisiera%20solicitar%20el%20video%20de%20la%20propiedad%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#48A82D] text-white rounded-xl text-xs font-bold"
                  >
                    <span>Pedir Video por WhatsApp</span>
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#48A82D]/10 rounded-xl text-[#48A82D]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Descripción & Detalles</h3>
                    <p className="text-xs text-zinc-500 font-medium">Información completa de la propiedad</p>
                  </div>
                </div>
              </div>

              {/* Main Description Box with stylish accent filete */}
              <div className="bg-zinc-50/80 border-l-4 border-l-[#48A82D] border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
                {property.description.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-sm text-zinc-700 leading-relaxed font-normal">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* LOTE SPECIFIC FEATURES IF APPLICABLE */}
              {property.lotFeatures && (
                <div className="bg-[#48A82D]/10 border border-[#48A82D]/30 p-4.5 rounded-2xl space-y-2.5 text-xs">
                  <h4 className="font-bold text-zinc-900 flex items-center gap-1.5 text-sm">
                    <Trees className="w-4 h-4 text-[#48A82D]" />
                    <span>Datos Técnicos del Lote</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-zinc-800 font-medium">
                    {property.lotFeatures.frontageMeters && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-[#48A82D]/20 shadow-2xs">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">Frente</span>
                        <strong className="text-xs text-zinc-900">{property.lotFeatures.frontageMeters} metros</strong>
                      </div>
                    )}
                    {property.lotFeatures.depthMeters && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-[#48A82D]/20 shadow-2xs">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">Fondo</span>
                        <strong className="text-xs text-zinc-900">{property.lotFeatures.depthMeters} metros</strong>
                      </div>
                    )}
                    <div className="bg-white/90 p-2.5 rounded-xl border border-[#48A82D]/20 shadow-2xs">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase block">Salida al Agua</span>
                      <strong className="text-xs text-zinc-900">{property.lotFeatures.waterAccess ? 'Sí (Directa)' : 'No'}</strong>
                    </div>
                    {property.lotFeatures.fosiFos && (
                      <div className="bg-white/90 p-2.5 rounded-xl border border-[#48A82D]/20 shadow-2xs">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block">Factibilidad FOS/FOT</span>
                        <strong className="text-xs text-zinc-900">{property.lotFeatures.fosiFos}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900">Amenities & Equipamiento</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#48A82D]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-[#48A82D]" />
                    <span>Ubicación de la Propiedad</span>
                  </h3>
                  <p className="text-xs text-zinc-600 font-medium">
                    {property.location.address}, {property.location.zone}, {property.location.city}
                  </p>
                </div>
                <a
                  href={externalGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#48A82D]" />
                </a>
              </div>

              <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-zinc-300 bg-zinc-100 group">
                <iframe
                  key={mapZoom}
                  title={`Mapa ${property.title}`}
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                {/* Overlay Map Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-300 p-1 gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.min(prev + 1, 19))}
                    disabled={mapZoom >= 19}
                    className="p-2 hover:bg-zinc-100 disabled:opacity-40 text-zinc-800 transition-colors cursor-pointer rounded-lg"
                    title="Acercar mapa (+)"
                  >
                    <Plus className="w-4 h-4 text-[#48A82D]" />
                  </button>
                  <div className="h-px bg-zinc-200 w-full" />
                  <button
                    type="button"
                    onClick={() => setMapZoom((prev) => Math.max(prev - 1, 10))}
                    disabled={mapZoom <= 10}
                    className="p-2 hover:bg-zinc-100 disabled:opacity-40 text-zinc-800 transition-colors cursor-pointer rounded-lg"
                    title="Alejar mapa (-)"
                  >
                    <Minus className="w-4 h-4 text-zinc-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL (DOUBLE-CLICK ZOOM) */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fadeIn"
          onClick={() => setZoomImage(null)}
        >
          <div className="w-full flex items-center justify-between text-white max-w-6xl">
            <div className="text-xs font-bold text-zinc-300">
              <span className="text-[#48A82D]">{property.title}</span> — {property.location.zone}
            </div>
            <button
              onClick={() => setZoomImage(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              title="Cerrar vista ampliada"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative max-w-6xl max-h-[85vh] flex items-center justify-center overflow-hidden my-auto p-2">
            <div className="relative inline-flex items-center justify-center max-w-full max-h-[82vh]">
              <img
                src={zoomImage}
                alt="Foto ampliada"
                className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-zinc-800"
                onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
                onClick={(e) => e.stopPropagation()}
              />
              {/* Subtle Logo Watermark Overlay for Zoom */}
              <div className="absolute bottom-6 right-6 pointer-events-none opacity-[0.4] z-10 w-24 h-24">
                <img src="/logo-white.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
            </div>
            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = property.images.indexOf(zoomImage);
                    const prevIdx = idx > 0 ? idx - 1 : property.images.length - 1;
                    setZoomImage(property.images[prevIdx]);
                    setActiveImageIndex(prevIdx);
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-xl border border-zinc-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = property.images.indexOf(zoomImage);
                    const nextIdx = idx < property.images.length - 1 ? idx + 1 : 0;
                    setZoomImage(property.images[nextIdx]);
                    setActiveImageIndex(nextIdx);
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all cursor-pointer shadow-xl border border-zinc-700"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="text-center text-xs text-zinc-400 font-medium">
            Haz clic fuera de la imagen o presiona la cruz para cerrar
          </div>
        </div>
      )}
    </div>
  );
};
