import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, DollarSign, CheckCircle2, Trees, Map, ShieldCheck } from 'lucide-react';
import { PropertyType, SearchFilters } from '../types';

const HERO_PHRASES = [
  { prefix: 'Encontrá tu propiedad en', green: 'General La Madrid y alrededores.' },
  { prefix: 'Encontrá el lugar donde', green: 'empieza tu próxima historia.' },
  { prefix: 'La casa de tus sueños está', green: 'más cerca de lo que imaginás.' },
  { prefix: 'Descubrí el hogar ideal', green: 'para vos y tu familia.' },
  { prefix: 'Donde imaginás vivir,', green: 'nosotros te ayudamos a llegar.' },
  { prefix: 'Elegí el espacio', green: 'que siempre soñaste.' },
  { prefix: 'Tu nuevo hogar', green: 'te está esperando.' },
  { prefix: 'Cada propiedad,', green: 'una nueva oportunidad.' },
  { prefix: 'Viví donde', green: 'siempre quisiste.' },
];

interface HeroSearchProps {
  filters: SearchFilters;
  onUpdateFilters: (updated: Partial<SearchFilters>) => void;
  totalResultsCount: number;
  onSearchSubmit: () => void;
  onOpenMapView?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onUpdateFilters,
  totalResultsCount,
  onSearchSubmit,
  onOpenMapView,
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  useEffect(() => {
    const currentPhraseObj = HERO_PHRASES[phraseIndex];
    const totalLength = currentPhraseObj.prefix.length + currentPhraseObj.green.length;
    let timer: NodeJS.Timeout;

    if (!isDeleting && charCount === totalLength) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
    } else if (isDeleting && charCount === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
      timer = setTimeout(() => {}, 200);
    } else {
      const speed = isDeleting ? 40 : 100;
      timer = setTimeout(() => {
        setCharCount((prev) => (isDeleting ? prev - 1 : prev + 1));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [charCount, isDeleting, phraseIndex]);

  const currentPhraseObj = HERO_PHRASES[phraseIndex];
  const typedPrefix = currentPhraseObj.prefix.substring(0, Math.min(charCount, currentPhraseObj.prefix.length));
  const typedGreen = charCount > currentPhraseObj.prefix.length
    ? currentPhraseObj.green.substring(0, charCount - currentPhraseObj.prefix.length)
    : '';

  const propertyTypeOptions: { value: PropertyType | 'TODOS'; label: string }[] = [
    { value: 'TODOS', label: 'Todos los tipos' },
    { value: 'Casa', label: 'Casa' },
    { value: 'Departamento', label: 'Departamento' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Local / Oficina', label: 'Local / Oficina' },
    { value: 'Galpón', label: 'Galpón' },
    { value: 'Lote / Terreno', label: 'Lote / Terreno' },
  ];

  const operationOptions = [
    { value: 'TODAS', label: 'Todas las operaciones' },
    { value: 'VENTA', label: 'Venta' },
    { value: 'ALQUILER', label: 'Alquiler' },
    { value: 'ALQUILER TEMPORAL', label: 'Alquiler Temporal' },
  ];

  return (
    <section className="relative text-white py-1 sm:py-4 px-3 sm:px-6 lg:px-8 w-full flex items-end sm:items-center justify-center">
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-2 sm:space-y-5 w-full">
        {/* Desktop Hero Headline (Typewriter) */}
        <div className="hidden sm:flex min-h-[5.5rem] lg:min-h-[6.5rem] items-center justify-center px-2 py-1 overflow-hidden">
          <h1 className="tracking-tight text-center max-w-6xl mx-auto flex flex-col items-center justify-center gap-0 leading-tight">
            {/* Line 1: White Text (Light) */}
            <span 
              className="block sm:text-5xl lg:text-[3.6rem] font-light text-white leading-tight text-center drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.95)]"
            >
              {typedPrefix || '\u00A0'}
              {charCount <= currentPhraseObj.prefix.length && (
                <span className="inline-block sm:w-[4px] h-[0.8em] bg-white ml-1.5 animate-pulse align-middle rounded-full drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.95)]" />
              )}
            </span>
            {/* Line 2: Green Accent Text (Bold / Black) */}
            <span 
              className="block sm:text-5xl lg:text-[3.6rem] font-black text-[#48A82D] leading-tight text-center drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.95)]"
            >
              {typedGreen || '\u00A0'}
              {charCount > currentPhraseObj.prefix.length && (
                <span className="inline-block sm:w-[4px] h-[0.8em] bg-[#48A82D] ml-1.5 animate-pulse align-middle rounded-full drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.95)]" />
              )}
            </span>
          </h1>
        </div>

        {/* TRANSLUCENT WHITE GLASS SEARCH WIDGET CARD */}
        <div className="mt-0 sm:mt-4 bg-white/20 backdrop-blur-[4px] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-4 sm:p-5 text-zinc-900 border border-white/40 max-w-6xl mx-auto transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Tipo de Propiedad Dropdown (4 cols) */}
            <div className="flex flex-col text-left md:col-span-4">
              <label className="text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1 drop-shadow-md">
                <Building2 className="w-4 h-4 text-[#48A82D]" />
                <span>Tipo de Propiedad</span>
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => onUpdateFilters({ propertyType: e.target.value as PropertyType | 'TODOS' })}
                className="w-full h-12 bg-white/95 border border-white/50 rounded-xl px-3 text-sm sm:text-base font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D] focus:border-[#48A82D] transition-all cursor-pointer shadow-sm accent-[#48A82D]"
              >
                {propertyTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-zinc-900 py-1">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operación Dropdown (4 cols) */}
            <div className="flex flex-col text-left md:col-span-4">
              <label className="text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1 drop-shadow-md">
                <DollarSign className="w-4 h-4 text-[#48A82D]" />
                <span>Operación</span>
              </label>
              <select
                value={filters.operation}
                onChange={(e) => onUpdateFilters({ operation: e.target.value as any })}
                className="w-full h-12 bg-white/95 border border-white/50 rounded-xl px-3 text-sm sm:text-base font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#48A82D] focus:border-[#48A82D] transition-all cursor-pointer shadow-sm accent-[#48A82D]"
              >
                {operationOptions.map((op) => (
                  <option key={op.value} value={op.value} className="bg-white text-zinc-900 py-1">
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search CTA and Maps Trigger (4 cols) */}
            <div className="flex flex-col text-left md:col-span-4">
              <div className="hidden md:block h-[20px] mb-1"></div>
              <div className="flex items-center gap-2">
                {onOpenMapView && (
                  <button
                    onClick={onOpenMapView}
                    className="group h-12 bg-white/95 hover:bg-[#48A82D] text-zinc-800 hover:text-white font-bold px-3 rounded-xl text-sm flex items-center justify-center gap-1 border border-white/50 hover:border-[#48A82D] transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                    title="Ver mapa de propiedades"
                  >
                    <Map className="w-4 h-4 text-[#48A82D] group-hover:text-white shrink-0 transition-colors" />
                    <span>Ver Mapa</span>
                  </button>
                )}

                <button
                  onClick={onSearchSubmit}
                  className="flex-1 h-12 bg-[#48A82D] hover:bg-[#3C8F24] text-white font-bold px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4.5 h-4.5 text-white shrink-0" />
                  <span>Buscar</span>
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};
