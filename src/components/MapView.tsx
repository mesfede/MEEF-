import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Search, Globe, Building2 } from 'lucide-react';
import { Property } from '../types';
import { getAssetUrl, formatLocationName, formatFullAddress } from '../lib/utils';


interface MapViewProps {
  properties: Property[];
  currency: 'USD' | 'ARS';
  onSelectProperty: (property: Property) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  properties,
  currency,
  onSelectProperty,
}) => {
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(
    properties[0] || null
  );
  const [mapSearchQuery, setMapSearchQuery] = useState('');

  const displayPrice = (property: Property) => {
    if ((!property.priceARS || property.priceARS <= 0) && (!property.priceUSD || property.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (property.priceARS && property.priceARS > 0) {
      return `$ ${property.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (property.priceUSD && property.priceUSD > 0) {
      return `USD $${property.priceUSD.toLocaleString('en-US')}`;
    }
    return 'Consultar';
  };

  const filteredMapProperties = mapSearchQuery.trim() === ''
    ? properties
    : properties.filter((p) =>
        p.title.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
        p.location.zone.toLowerCase().includes(mapSearchQuery.toLowerCase()) ||
        p.location.address.toLowerCase().includes(mapSearchQuery.toLowerCase())
      );

  const activeProp = selectedMapProperty || properties[0];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-lg relative">
      {/* Top Map Toolbar / Search Bar */}
      <div className="bg-[#181818] text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img
            src={getAssetUrl('/mef-logo-white.png')}
            onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = getAssetUrl('/MEF_logo_svg.png'); }}
            alt="MEF Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="text-left border-l border-zinc-700 pl-3">
            <span className="text-xs font-bold text-[#48A82D] block uppercase tracking-wider">
              Módulo de Búsqueda por Google Maps
            </span>
            <span className="text-[11px] text-zinc-400">
              General La Madrid y la zona ({filteredMapProperties.length} ubicadas)
            </span>
          </div>
        </div>

        {/* Map Search Input & Direct Google Maps CTA */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 hidden sm:block">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por ubicación, zona o título..."
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#48A82D]"
            />
          </div>

          {activeProp && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                activeProp.location.address + ', ' + activeProp.location.city + ', Buenos Aires'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#48A82D] hover:bg-green-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap shadow-md"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Abrir en Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="h-[520px] bg-zinc-900 relative overflow-hidden flex items-center justify-center">
        {/* Dynamic Map Tile Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-900/30 to-zinc-950/70"></div>

        {/* Map Grid / Topo Lines Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#48A82D_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        {/* Floating Property Pins with Brand Logo Badges */}
        <div className="absolute inset-0 p-6 flex flex-wrap items-center justify-around pointer-events-none overflow-y-auto">
          {filteredMapProperties.map((p) => {
            const isSelected = activeProp?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedMapProperty(p)}
                className={`pointer-events-auto transition-all duration-300 cursor-pointer m-3 group relative ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
                }`}
              >
                {/* Custom Brand Marker Card */}
                <div
                  className={`bg-white rounded-2xl p-2.5 shadow-xl border-2 flex items-center gap-2.5 max-w-[220px] transition-all ${
                    isSelected
                      ? 'border-[#48A82D] ring-4 ring-[#48A82D]/20 bg-zinc-900 text-white'
                      : 'border-zinc-200 hover:border-[#48A82D] text-zinc-900'
                  }`}
                >
                  {/* Brand Logo Thumbnail */}
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 p-1 flex items-center justify-center shrink-0 border border-zinc-700">
                    <img
                      src={getAssetUrl('/mef-logo-white.png')}
                      onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = getAssetUrl('/MEF_logo_svg.png'); }}
                      alt="MEF"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="flex flex-col text-left min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black uppercase text-[#48A82D] tracking-wider truncate">
                        {formatLocationName(p.location.zone, p.location.city)}
                      </span>
                    </div>
                    <span className="text-xs font-bold truncate leading-snug">
                      {p.title}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#48A82D]">
                      {displayPrice(p)}
                    </span>
                  </div>
                </div>

                {/* Pin Tip Pointer */}
                <div
                  className={`w-3 h-3 rotate-45 mx-auto -mt-1.5 transition-all ${
                    isSelected ? 'bg-[#48A82D]' : 'bg-white border-r border-b border-zinc-300'
                  }`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Selected Property Popup Info Panel */}
        {activeProp && (
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-[#48A82D] z-40 text-zinc-900 flex gap-4 items-center">
            <img
              src={activeProp.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
              alt={activeProp.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-zinc-200"
              onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
            />
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  activeProp.operation === 'VENTA'
                    ? 'bg-black text-white'
                    : activeProp.operation === 'ALQUILER' || activeProp.operation === 'ALQUILER TEMPORAL'
                    ? 'bg-zinc-500 text-white'
                    : 'bg-[#48A82D] text-white'
                }`}>
                  {activeProp.operation}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  {activeProp.type}
                </span>
              </div>
              <h4 className="text-xs font-bold text-zinc-900 truncate mt-1">
                {activeProp.title}
              </h4>
              <p className="text-xs text-zinc-600 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#48A82D] shrink-0" />
                <span>{formatFullAddress(activeProp.location.address, activeProp.location.zone, activeProp.location.city)}</span>
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200">
                <span className="text-sm font-extrabold text-[#48A82D]">
                  {displayPrice(activeProp)}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeProp.location.address + ', ' + activeProp.location.city + ', Argentina'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-zinc-700 hover:text-[#48A82D] flex items-center gap-1 transition-colors"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onSelectProperty(activeProp)}
                    className="bg-[#181818] hover:bg-[#48A82D] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Ver Ficha
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Cards Strip below map */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#48A82D]" />
            <span>Propiedades Ubicadas en el Mapa ({filteredMapProperties.length})</span>
          </h4>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {filteredMapProperties.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedMapProperty(p);
                onSelectProperty(p);
              }}
              className={`w-[78%] sm:w-64 rounded-xl p-3 border shadow-xs transition-all cursor-pointer shrink-0 flex gap-3 items-center ${
                activeProp?.id === p.id
                  ? 'bg-zinc-900 text-white border-[#48A82D] ring-2 ring-[#48A82D]/30'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:border-[#48A82D]'
              }`}
            >
              <img
                src={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                alt={p.title}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#48A82D] uppercase">{p.operation}</span>
                  <span className="text-[9px] text-zinc-400 font-medium">{formatLocationName(p.location.zone, p.location.city)}</span>
                </div>
                <h5 className="text-xs font-bold truncate mt-0.5">{p.title}</h5>
                <p className="text-[11px] font-bold text-[#48A82D] mt-0.5">{displayPrice(p)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
