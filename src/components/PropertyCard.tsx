import React, { useState } from 'react';
import { Heart, MapPin, Maximize, Bed, Bath, Car, Trees, ArrowUpRight, ChevronLeft, ChevronRight, Video, Play, Star, Flame, Instagram, Edit3, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  currency: 'USD' | 'ARS';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  isAdmin?: boolean;
  onEditProperty?: (property: Property) => void;
  onDeleteProperty?: (id: string) => void;
  onMoveUpProperty?: (id: string) => void;
  onMoveDownProperty?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  isAdmin,
  onEditProperty,
  onDeleteProperty,
  onMoveUpProperty,
  onMoveDownProperty,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
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
    const ars = property.priceARS || (property.priceUSD ? property.priceUSD * 1350 : 0);
    if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const getOperationBadgeColor = () => {
    switch (property.operation) {
      case 'VENTA':
        return 'bg-black text-white';
      case 'ALQUILER':
      case 'ALQUILER TEMPORAL':
        return 'bg-zinc-500 text-white';
      case 'LOTES':
        return 'bg-[#48A82D] text-white';
      default:
        return 'bg-black text-white';
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* CARD TOP IMAGE CONTAINER */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
        />
        
        {/* Subtle Logo Watermark Overlay */}
        <div className="absolute bottom-3 right-3 pointer-events-none opacity-[0.4] z-10 w-12 h-12">
          <img src="/logo-white.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Carousel arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {property.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Operation & Ref Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getOperationBadgeColor()}`}>
            {property.operation}
          </span>
          {property.isRecentlyUploaded && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-yellow-400 text-yellow-950 uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 fill-yellow-950 text-yellow-950" />
              <span>RECIÉN SUBIDA</span>
            </span>
          )}
          {(property.videoUrl || property.instagramUrl) && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-rose-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Instagram className="w-3.5 h-3.5 text-white shrink-0" />
              <span>VIDEO IG</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md transition-all cursor-pointer"
          title="Guardar en favoritos"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#48A82D] text-[#48A82D]' : 'text-zinc-600 hover:text-[#48A82D]'
            }`}
          />
        </button>
      </div>

      {/* CARD BODY DETAILS */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xl font-black text-zinc-900 tracking-tight">
              {displayPrice()}
            </span>
            {Boolean(property.expensesARS && property.expensesARS > 0) && (
              <span className="text-xs text-zinc-500 font-medium">
                Expensas: ${property.expensesARS?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base font-bold text-zinc-900 group-hover:text-[#48A82D] transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#48A82D] shrink-0" />
            <span className="truncate">{property.location.zone}, {property.location.city}</span>
          </div>
        </div>

        {/* SPECS STRIP */}
        <div className="pt-3 border-t border-zinc-100 grid grid-cols-4 gap-1.5 text-center bg-zinc-50/90 py-3 px-2 rounded-xl">
          {property.operation === 'LOTES' || property.type === 'Lote / Terreno' ? (
            <>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm leading-none">{property.totalArea} m²</span>
                <Maximize className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#48A82D] text-xs leading-none">
                  {property.lotFeatures?.waterAccess ? 'Agua' : 'Plano'}
                </span>
                <Trees className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.coveredArea > 0 ? `${property.coveredArea} m²` : '—'}
                </span>
                <Maximize className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.bedrooms > 0 ? property.bedrooms : '—'}
                </span>
                <Bed className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.bathrooms > 0 ? property.bathrooms : '—'}
                </span>
                <Bath className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-zinc-900 text-sm sm:text-base leading-none">
                  {property.garages > 0 ? property.garages : '—'}
                </span>
                <Car className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
            </>
          )}
        </div>

        {/* CARD FOOTER ACTIONS */}
        {showConfirmDelete ? (
          <div className="pt-2 flex items-center justify-between gap-2 bg-red-50 p-2.5 rounded-xl border border-red-300 animate-fadeIn">
            <span className="text-[11px] font-bold text-red-900">¿Eliminar esta propiedad?</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                  if (onDeleteProperty) {
                    onDeleteProperty(property.id);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                Sí, Eliminar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                }}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex items-center gap-1.5">
            {isAdmin && (
              <>
                {onMoveUpProperty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUpProperty(property.id);
                    }}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-emerald-300"
                    title="Mover propiedad arriba en el catálogo"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {onMoveDownProperty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDownProperty(property.id);
                    }}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-emerald-300"
                    title="Mover propiedad abajo en el catálogo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditProperty) onEditProperty(property);
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-amber-300"
                  title="Editar propiedad en Firebase"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(true);
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-300"
                  title="Eliminar propiedad"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              onClick={() => onSelectProperty(property)}
              className="flex-1 bg-zinc-100 hover:bg-[#181818] text-zinc-800 hover:text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-zinc-200"
            >
              <span>Ver Ficha</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={`https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-[#48A82D] hover:bg-[#3C8F24] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Consultar por WhatsApp"
            >
              <span>Consultar</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
