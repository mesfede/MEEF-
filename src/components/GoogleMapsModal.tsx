import React, { useState } from 'react';
import { X, MapPin, ExternalLink, Building2, Search, Navigation, DollarSign, Trees, ArrowRight, Eye } from 'lucide-react';
import { Property, OperationType } from '../types';

interface GoogleMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const GoogleMapsModal: React.FC<GoogleMapsModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
}) => {
  const [selectedOp, setSelectedOp] = useState<OperationType | 'TODAS'>('TODAS');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProperties = properties.filter((p) => {
    const matchesOp = selectedOp === 'TODAS' || p.operation === selectedOp;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOp && matchesSearch;
  });

  const activeProp = selectedProperty || filteredProperties[0] || properties[0];

  // Map Embed Query: use exact address or latitude/longitude for maximum accuracy
  const mapQuery = activeProp
    ? `${activeProp.location.lat},${activeProp.location.lng}`
    : '-37.2483,-61.2619';

  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const externalGoogleMapsUrl = activeProp
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${activeProp.location.address}, ${activeProp.location.city}, Buenos Aires`
      )}`
    : 'https://www.google.com/maps';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-6xl h-[92vh] max-h-[850px] rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="bg-[#181818] text-white p-4 sm:px-6 flex items-center justify-between shrink-0 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src="/mef-logo-white.png"
              onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = '/MEF_logo_svg.png'; }}
              alt="MEF Negocios Inmobiliarios"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            <div className="hidden sm:block border-l border-zinc-700 pl-3 text-left">
              <h3 className="text-xs sm:text-sm font-bold text-[#48A82D] uppercase tracking-wider">
                Ubicación de Propiedades en Google Maps
              </h3>
              <p className="text-[11px] text-zinc-400">
                Visualización interactiva de casas, quintas, departamentos y lotes en la zona
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar mapa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL NAVBAR / OPERATION FILTERS */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedOp('TODAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedOp === 'TODAS'
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
              }`}
            >
              Todas ({properties.length})
            </button>
            <button
              onClick={() => setSelectedOp('VENTA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedOp === 'VENTA'
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#48A82D]" />
              <span>Ventas</span>
            </button>
            <button
              onClick={() => setSelectedOp('ALQUILER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedOp === 'ALQUILER'
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#48A82D]" />
              <span>Alquileres</span>
            </button>
            <button
              onClick={() => setSelectedOp('LOTES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedOp === 'LOTES'
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-[#48A82D]" />
              <span>Lotes</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por dirección, zona o título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D]"
            />
          </div>
        </div>

        {/* MODAL MAIN CONTENT: SIDEBAR + MAP IFRAME */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* PROPERTY SELECTOR SIDEBAR */}
          <div className="w-full md:w-80 lg:w-96 bg-zinc-50 border-r border-zinc-200 flex flex-col shrink-0 h-48 md:h-full overflow-hidden">
            <div className="p-2.5 bg-zinc-200/60 text-left border-b border-zinc-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Propiedades ({filteredProperties.length})
              </span>
              <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
                Doble clic para ver ficha
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {filteredProperties.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs font-medium">
                  No se encontraron propiedades con ese criterio.
                </div>
              ) : (
                filteredProperties.map((p) => {
                  const isSelected = activeProp?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProperty(p)}
                      onDoubleClick={() => {
                        onClose();
                        onSelectProperty(p);
                      }}
                      title="Haz clic para ubicar en el mapa, o doble clic para ver la ficha completa"
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex gap-3 items-center group relative ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-[#48A82D] shadow-md ring-1 ring-[#48A82D]'
                          : 'bg-white text-zinc-900 border-zinc-200 hover:border-[#48A82D] hover:shadow-xs'
                      }`}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-zinc-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider ${
                              isSelected ? 'text-[#48A82D]' : 'text-[#48A82D]'
                            }`}
                          >
                            {p.location.zone}
                          </span>
                          <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {p.operation}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold truncate mt-0.5">{p.title}</h4>
                        <p className={`text-[11px] font-medium truncate flex items-center gap-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          <MapPin className="w-3 h-3 text-[#48A82D] shrink-0" />
                          <span>{p.location.address}</span>
                        </p>
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-700/20">
                          <p className="text-xs font-extrabold text-[#48A82D]">
                            {p.priceARS && p.priceARS > 0
                              ? `$ ${p.priceARS.toLocaleString('es-AR')} ARS`
                              : p.priceUSD && p.priceUSD > 0
                              ? `USD $${p.priceUSD.toLocaleString('en-US')}`
                              : 'Consultar'}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onSelectProperty(p);
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                              isSelected
                                ? 'bg-[#48A82D] text-white hover:bg-[#3d9124]'
                                : 'bg-zinc-100 text-zinc-800 hover:bg-[#48A82D] hover:text-white border border-zinc-300'
                            }`}
                          >
                            Ver Ficha
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* GOOGLE MAPS IFRAME STAGE */}
          <div className="flex-1 bg-zinc-200 relative flex flex-col">
            {/* MAP IFRAME */}
            <div className="w-full h-full relative overflow-hidden bg-zinc-100">
              <iframe
                title="Google Maps Visualizer"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
