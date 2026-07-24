import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Building2, DollarSign, CheckCircle2, Trees, Map, Sparkles, ShieldCheck } from 'lucide-react';
import { OperationType, PropertyType, SearchFilters } from '../types';
import { ZONES_LIST } from '../data/properties';

interface HeroSearchProps {
  filters: SearchFilters;
  onUpdateFilters: (updated: Partial<SearchFilters>) => void;
  onOpenAdvancedFilters: () => void;
  totalResultsCount: number;
  onSearchSubmit: () => void;
  onOpenMapView?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onUpdateFilters,
  onOpenAdvancedFilters,
  totalResultsCount,
  onSearchSubmit,
  onOpenMapView,
}) => {
  const [keyword, setKeyword] = useState(filters.refCodeSearch || '');

  const propertyTypeOptions: (PropertyType | 'TODOS')[] = [
    'TODOS',
    'Casa',
    'Departamento',
    'Lote / Terreno',
    'Barrio Cerrado',
    'PH',
    'Local / Oficina',
  ];

  const handleTabChange = (op: OperationType) => {
    onUpdateFilters({ operation: op });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    onUpdateFilters({ refCodeSearch: val });
  };

  return (
    <section className="relative bg-[#181818] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Architectural Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#48A82D]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#48A82D]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#48A82D]/40 text-[#48A82D] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#48A82D]" />
          <span className="text-white font-medium">MARIA EUGENIA FERNÁNDEZ • General La Madrid & Región</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Encontrá tu propiedad en <br className="hidden sm:inline" />
          <span className="text-[#48A82D]">
            General La Madrid y alrededores
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-zinc-300 text-sm sm:text-base font-normal leading-relaxed">
          Especialistas en la venta, alquiler y tasación de casas, quintas, lotes y campos en General La Madrid, Laprida, Coronel Suárez y la zona.
        </p>

        {/* SEARCH WIDGET CARD */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-zinc-800 border border-zinc-200 max-w-4xl mx-auto transition-all">
          {/* Operation Tabs [VENTA | ALQUILER | LOTES | GOOGLE MAPS] */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleTabChange('VENTA')}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                  filters.operation === 'VENTA'
                    ? 'bg-[#181818] text-white border-2 border-[#48A82D] shadow-md'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <Building2 className={`w-4 h-4 ${filters.operation === 'VENTA' ? 'text-[#48A82D]' : 'text-zinc-500'}`} />
                <span>VENTAS</span>
              </button>

              <button
                onClick={() => handleTabChange('ALQUILER')}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                  filters.operation === 'ALQUILER'
                    ? 'bg-[#181818] text-white border-2 border-[#48A82D] shadow-md'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <DollarSign className={`w-4 h-4 ${filters.operation === 'ALQUILER' ? 'text-[#48A82D]' : 'text-zinc-500'}`} />
                <span>ALQUILERES</span>
              </button>

              <button
                onClick={() => handleTabChange('LOTES')}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                  filters.operation === 'LOTES'
                    ? 'bg-[#181818] text-white border-2 border-[#48A82D] shadow-md'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <Trees className={`w-4 h-4 ${filters.operation === 'LOTES' ? 'text-[#48A82D]' : 'text-zinc-500'}`} />
                <span>LOTES Y TERRENOS</span>
              </button>
            </div>

            {onOpenMapView && (
              <button
                onClick={onOpenMapView}
                className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-emerald-50 text-[#48A82D] border-2 border-[#48A82D] hover:bg-[#48A82D] hover:text-white transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                title="Ver propiedades en Google Maps"
              >
                <Map className="w-4 h-4" />
                <span>Buscar por Google Maps</span>
              </button>
            )}
          </div>

          {/* Quick Filters Bar (12 Columns for tight COD.REF and airy Buscar button) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            {/* Property Type Dropdown (3 cols) */}
            <div className="flex flex-col text-left lg:col-span-3">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#48A82D]" />
                <span>Tipo de Propiedad</span>
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => onUpdateFilters({ propertyType: e.target.value as PropertyType | 'TODOS' })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D] transition-all"
              >
                {propertyTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type === 'TODOS' ? 'Todos los tipos' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone / Location Dropdown (3 cols) */}
            <div className="flex flex-col text-left lg:col-span-3">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#48A82D]" />
                <span>Zona / Barrio</span>
              </label>
              <select
                value={filters.zone}
                onChange={(e) => onUpdateFilters({ zone: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D] transition-all"
              >
                {ZONES_LIST.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword or Ref Code Search (Narrower: 2 cols) */}
            <div className="flex flex-col text-left lg:col-span-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-[#48A82D]" />
                <span>COD.REF</span>
              </label>
              <input
                type="text"
                placeholder="MEF-GLM01"
                value={keyword}
                onChange={handleKeywordChange}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-2.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#48A82D] transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Search CTA and Advanced Filters trigger (Spacious: 4 cols) */}
            <div className="flex items-center gap-2 lg:col-span-4">
              <button
                onClick={onOpenAdvancedFilters}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold px-3 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer border border-zinc-300 whitespace-nowrap shrink-0"
                title="Abrir filtros avanzados"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#48A82D]" />
                <span>Filtros</span>
              </button>

              <button
                onClick={onSearchSubmit}
                className="flex-1 bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold px-4 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <Search className="w-4 h-4 text-white shrink-0" />
                <span className="whitespace-nowrap">Buscar ({totalResultsCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-zinc-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#48A82D]" />
            <span>Asesoramiento Legal e Inmobiliario</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#48A82D]" />
            <span>Tasaciones Profesionales</span>
          </div>
          <div className="flex items-center gap-2">
            <Trees className="w-4 h-4 text-[#48A82D]" />
            <span>Casas, Quintas, Lotes y Campos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
