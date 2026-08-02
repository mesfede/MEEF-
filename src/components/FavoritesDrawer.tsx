import React from 'react';
import { X, Trash2, Heart, ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { Property } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteProperties: Property[];
  currency: 'USD' | 'ARS';
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteProperties,
  currency,
  onRemoveFavorite,
  onSelectProperty,
}) => {
  if (!isOpen) return null;

  const displayPrice = (property: Property) => {
    if ((!property.priceARS || property.priceARS <= 0) && (!property.priceUSD || property.priceUSD <= 0)) {
      return 'Consultar';
    }
    if (property.priceARS && property.priceARS > 0) {
      return `$ ${property.priceARS.toLocaleString('es-AR')} ARS`;
    }
    if (currency === 'USD' && property.priceUSD && property.priceUSD > 0) {
      return `USD $${property.priceUSD.toLocaleString('en-US')}`;
    }
    const ars = property.priceARS || (property.priceUSD ? property.priceUSD * 1350 : 0);
    if (ars > 0) {
      return `$ ${ars.toLocaleString('es-AR')} ARS`;
    }
    return 'Consultar';
  };

  const shareFavoritesWhatsApp = () => {
    const items = favoriteProperties.map((p) => `${p.title} (${p.location.zone})`).join('\n- ');
    const text = encodeURIComponent(
      `Hola MARIA EUGENIA FERNÁNDEZ Negocios Inmobiliarios, estuve guardando estas propiedades y quisiera más información:\n- ${items}`
    );
    window.open(`https://wa.me/5492284603168?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="bg-[#181818] text-white p-5 flex items-center justify-between border-b border-[#48A82D]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#48A82D] text-[#48A82D]" />
            <h2 className="text-lg font-bold">
              Mis Favoritos ({favoriteProperties.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-zinc-400">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-zinc-300" />
              <p className="text-sm font-medium text-zinc-600">No tenés propiedades guardadas aún.</p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Hacé clic en el ícono de corazón en cualquier propiedad para compararlas fácilmente aquí.
              </p>
            </div>
          ) : (
            favoriteProperties.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-50 border border-zinc-200 p-3 rounded-2xl flex gap-3 items-center hover:bg-zinc-100 transition-all group"
              >
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                  alt={p.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                  onError={(e) => { if (e.currentTarget.dataset.hasError) return; e.currentTarget.dataset.hasError = 'true'; e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'; }}
                  onClick={() => {
                    onSelectProperty(p);
                    onClose();
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#48A82D] uppercase tracking-wider">
                      {p.operation} • {p.location.zone}
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(p.id)}
                      className="text-zinc-400 hover:text-red-600 p-1 rounded transition-colors"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectProperty(p);
                      onClose();
                    }}
                    className="text-xs font-bold text-zinc-900 truncate cursor-pointer hover:text-[#48A82D]"
                  >
                    {p.title}
                  </h4>

                  <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#48A82D]" />
                    <span>{p.location.zone}</span>
                  </p>

                  <p className="text-sm font-bold text-zinc-900 mt-1">
                    {displayPrice(p)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoriteProperties.length > 0 && (
          <div className="p-4 bg-white border-t border-zinc-200 space-y-2">
            <button
              onClick={shareFavoritesWhatsApp}
              className="w-full bg-[#48A82D] hover:bg-[#3C8F24] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Consultar Selección por WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
