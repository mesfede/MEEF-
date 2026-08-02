import React, { useMemo } from 'react';
import { Home, Play, ArrowUpRight, MapPin, Maximize, Bed, Bath, Car, Video } from 'lucide-react';
import { Property } from '../types';
import { getAssetUrl } from '../lib/utils';


interface RecentSpotlightProps {
  properties: Property[];
  currency: 'USD' | 'ARS';
  onSelectProperty: (property: Property) => void;
}

export const RecentSpotlight: React.FC<RecentSpotlightProps> = ({
  properties,
  currency,
  onSelectProperty,
}) => {
  // Find the spotlight property: strictly the one marked as featured
  const spotlightProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    return properties.find((p) => p.featured) || null;
  }, [properties]);

  if (!spotlightProperty) return null;

  const displayPrice = () => {
    if ((!spotlightProperty.priceARS || spotlightProperty.priceARS <= 0) && (!spotlightProperty.priceUSD || spotlightProperty.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (spotlightProperty.priceARS && spotlightProperty.priceARS > 0) {
      return `$ ${spotlightProperty.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (currency === 'USD' && spotlightProperty.priceUSD > 0) {
      return `USD $${spotlightProperty.priceUSD.toLocaleString('en-US')}`;
    }
    const ars = spotlightProperty.priceARS || (spotlightProperty.priceUSD ? spotlightProperty.priceUSD * 1350 : 0);
    if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const getOperationBadgeColor = (op?: string) => {
    switch (op) {
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

  const hasVideoOrReel = Boolean(spotlightProperty.videoUrl || spotlightProperty.instagramUrl);

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-3xl p-6 sm:p-8 text-white border-2 border-[#48A82D]/40 shadow-2xl relative overflow-hidden group">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#48A82D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch">
        {/* MEDIA PREVIEW CONTAINER (Always Main Selected Image) */}
        <div
          className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shadow-xl cursor-pointer flex flex-col justify-between group/img"
          onClick={() => onSelectProperty(spotlightProperty)}
        >
          {/* Main property image */}
          <img
            src={spotlightProperty.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
            alt={spotlightProperty.title}
            className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 brightness-[1.04] contrast-[1.02] saturate-[1.06]"
            onError={(e) => {
              if (e.currentTarget.dataset.hasError) return;
              e.currentTarget.dataset.hasError = 'true';
              e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Subtle Logo Watermark Overlay */}
          <div className="absolute bottom-4 right-4 pointer-events-none opacity-[0.4] z-10 w-16 h-16">
            <img src={getAssetUrl('/logo-white.png')} alt="" className="w-full h-full object-contain drop-shadow-md" />
          </div>

          {hasVideoOrReel && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/img:bg-transparent transition-colors pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-[#48A82D]/95 text-white flex items-center justify-center shadow-xl group-hover/img:scale-110 transition-transform border-2 border-white/60">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Clear, luminous vignette keeping top skies bright */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {/* 1. Propiedad destacada tag with house icon and pulsing animation */}
            <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md animate-pulse">
              <Home className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Propiedad destacada</span>
            </span>

            {/* 2. Operation Tag (Venta, Alquiler, Lotes) */}
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${getOperationBadgeColor(spotlightProperty.operation)}`}>
              {spotlightProperty.operation}
            </span>

            {/* 3. Video tag conditionally rendered */}
            {hasVideoOrReel && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Video className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Video</span>
              </span>
            )}
          </div>

          <div className="relative z-10 p-3 mt-auto flex items-center justify-between text-xs font-semibold text-white">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#48A82D] shrink-0" />
              <span>{spotlightProperty.location.zone}</span>
            </span>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              {/* 1. Title first */}
              <h3
                onClick={() => onSelectProperty(spotlightProperty)}
                className="text-xl sm:text-2xl font-bold text-white leading-snug hover:text-[#48A82D] transition-colors cursor-pointer"
              >
                {spotlightProperty.title}
              </h3>

              {/* 2. Price / Consultar second */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[#48A82D] tracking-tight">
                  {displayPrice()}
                </span>
              </div>

              {/* 3. Address & location */}
              <p className="text-xs text-zinc-400 flex items-center gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5 text-[#48A82D] shrink-0" />
                <span>{spotlightProperty.location.address}, {spotlightProperty.location.zone}, {spotlightProperty.location.city}</span>
              </p>
            </div>

            {/* Description (Hidden on mobile) */}
            <p className="hidden sm:block text-xs text-zinc-300 line-clamp-3 leading-relaxed">
              {spotlightProperty.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-4 gap-2 text-center bg-zinc-800/80 py-3 px-2 rounded-xl border border-zinc-700/60">
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.coveredArea || spotlightProperty.totalArea ? `${spotlightProperty.coveredArea || spotlightProperty.totalArea} m²` : '—'}
                </span>
                <Maximize className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.bedrooms || '—'}
                </span>
                <Bed className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.bathrooms || '—'}
                </span>
                <Bath className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-extrabold text-white text-sm sm:text-base leading-none">
                  {spotlightProperty.garages || '—'}
                </span>
                <Car className="w-[22px] h-[22px] text-[#48A82D] mt-2" />
              </div>
            </div>
          </div>

          {/* Actions - Aligned with the bottom of the image */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSelectProperty(spotlightProperty)}
              className="flex-1 bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Ver Ficha</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/5492284603168?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quiero%20consultar%20por%20la%20propiedad%20${encodeURIComponent(spotlightProperty.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-zinc-600 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer"
            >
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

