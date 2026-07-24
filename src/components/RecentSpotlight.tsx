import React from 'react';
import { Sparkles, Video, Play, ArrowUpRight, MapPin, Maximize, Bed, Bath, Car, Phone } from 'lucide-react';
import { Property } from '../types';

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
  // Find the top recently uploaded property or featured property with video
  const spotlightProperty =
    properties.find((p) => p.isRecentlyUploaded && p.videoUrl) ||
    properties.find((p) => p.isRecentlyUploaded) ||
    properties.find((p) => p.featured && p.videoUrl);

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

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-3xl p-6 sm:p-8 text-white border-2 border-[#48A82D]/40 shadow-2xl relative overflow-hidden group">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#48A82D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
        {/* MEDIA PREVIEW / VIDEO PLAYER */}
        <div className="w-full lg:w-1/2 relative aspect-16/9 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shadow-xl cursor-pointer" onClick={() => onSelectProperty(spotlightProperty)}>
          {spotlightProperty.videoUrl ? (
            <video
              src={spotlightProperty.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <img
              src={spotlightProperty.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
              alt={spotlightProperty.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const img = e.currentTarget;
                img.onerror = null;
                img.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Propiedad Destacada • Recién Subida</span>
            </span>
            {spotlightProperty.videoUrl && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Play className="w-3 h-3 fill-white" />
                <span>Video Tour IG</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg">
              Ref: {spotlightProperty.refCode}
            </span>
            <span className="bg-[#48A82D] text-white px-3 py-1 rounded-lg font-bold">
              Click para ver Ficha Completa
            </span>
          </div>
        </div>

        {/* DETAILS COLUMN */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#48A82D]/20 text-[#48A82D] text-xs font-bold border border-[#48A82D]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ÚLTIMA NOVEDAD EN INSTAGRAM</span>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#48A82D] block tracking-tight">
              {displayPrice()}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mt-1 hover:text-[#48A82D] transition-colors cursor-pointer" onClick={() => onSelectProperty(spotlightProperty)}>
              {spotlightProperty.title}
            </h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#48A82D]" />
              <span>{spotlightProperty.location.address}, {spotlightProperty.location.zone}, {spotlightProperty.location.city}</span>
            </p>
          </div>

          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
            {spotlightProperty.description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs bg-zinc-800/80 p-3 rounded-xl border border-zinc-700/60">
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase">Superficie</span>
              <span className="font-bold text-white">{spotlightProperty.coveredArea || spotlightProperty.totalArea} m²</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Dormitorios</span>
              <span className="font-bold text-white">{spotlightProperty.bedrooms || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Baños</span>
              <span className="font-bold text-white">{spotlightProperty.bathrooms || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block">Operación</span>
              <span className="font-bold text-[#48A82D]">{spotlightProperty.operation}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onSelectProperty(spotlightProperty)}
              className="flex-1 bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Ver Fotos & Video Tour</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quiero%20consultar%20por%20el%20destacado%20Ref:%20${spotlightProperty.refCode}%20(${encodeURIComponent(spotlightProperty.title)})`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-zinc-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#48A82D]" />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
