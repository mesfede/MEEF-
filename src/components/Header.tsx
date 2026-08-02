import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Calculator, Shield, Sparkles, Building2, Home, MapPin, ChevronRight, Phone } from 'lucide-react';
import { OperationType } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  favoritesCount: number;
  currency: 'USD' | 'ARS';
  onToggleCurrency: () => void;
  onOpenFavorites: () => void;
  onOpenValuationModal: () => void;
  activeOperation: OperationType | 'TODAS';
  onSelectOperation: (op: OperationType | 'TODAS') => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdminLogin?: () => void;
  isAdminLoggedIn?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  onOpenValuationModal,
  activeOperation,
  onSelectOperation,
  onScrollToSection,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onMenuToggle,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    onMenuToggle?.(menuOpen);
  }, [menuOpen, onMenuToggle]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, op?: OperationType | 'TODAS') => {
    if (op !== undefined) {
      onSelectOperation(op);
    }
    onScrollToSection(sectionId);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Floating Header with Sticky Scroll Effect */}
      <header
        className={`fixed left-0 right-0 z-40 w-full transition-all duration-300 ${
          isAdminLoggedIn ? 'top-[52px]' : 'top-0'
        } ${
          scrolled
            ? 'bg-white/40 backdrop-blur-md border-b border-zinc-200/50 shadow-sm py-2.5 sm:py-2.5'
            : 'bg-transparent border-b border-transparent shadow-none pt-7 pb-2.5 sm:pt-6 sm:pb-3'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. LEFT SIDE: BRAND LOGO */}
            <div
              onClick={() => handleNavClick('hero', 'TODAS')}
              className={`cursor-pointer group flex items-center justify-start shrink-0 transition-transform duration-300 origin-left ${scrolled ? 'scale-[0.7]' : 'scale-100'}`}
            >
              <Logo size="md" variant="dark" />
            </div>
            
            {/* 2. RIGHT SIDE: TASAR PROPIEDAD, FAVORITES, & HAMBURGER MENU */}
            <div className="flex items-center space-x-2 sm:space-x-3 justify-end">
              {/* Tasar Propiedad CTA - Black Background */}
              <button
                onClick={onOpenValuationModal}
                className="inline-flex items-center gap-1.5 bg-[#181818] hover:bg-black text-white text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md transition-all hover:scale-105 cursor-pointer border border-zinc-800 hover:border-[#48A82D] shrink-0 group"
              >
                <Calculator className="w-3.5 h-3.5 text-[#48A82D] group-hover:rotate-12 transition-transform" />
                <span className="hidden xs:inline sm:inline whitespace-nowrap">Tasar Propiedad</span>
              </button>

              {/* Favorites Heart Button - Black Background */}
              <button
                onClick={onOpenFavorites}
                className="relative p-2 sm:p-2.5 bg-[#181818] hover:bg-black text-white rounded-full transition-all cursor-pointer shadow-md border border-zinc-800 hover:border-[#48A82D] hover:scale-105 shrink-0"
                title="Propiedades Guardadas"
                aria-label="Ver favoritos"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favoritesCount > 0 ? 'text-[#48A82D] fill-[#48A82D]' : 'text-white'}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#48A82D] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Custom Hamburger Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer flex items-center justify-center shadow-md border hover:scale-105 ${
                  menuOpen
                    ? 'opacity-0 pointer-events-none'
                    : 'bg-[#181818] hover:bg-black text-white border-zinc-800 hover:border-[#48A82D]'
                }`}
                title="Menú de navegación"
                aria-label="Abrir menú"
              >
                <div className="w-5 h-4 flex flex-col justify-between items-center py-[1px]">
                  <span className="w-5 h-[2.5px] bg-white rounded-full" />
                  <span className="w-5 h-[2.5px] bg-[#48A82D] rounded-full" />
                  <span className="w-5 h-[2.5px] bg-white rounded-full" />
                </div>
              </button>
            </div>

          </div>
          </div>
      </header>

      {/* COMPACT FLOATING NAVIGATION MENU */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-all duration-300 flex items-start justify-end p-3 sm:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs sm:max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200/80 mt-14 sm:mt-16 animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
              <Logo size="sm" variant="dark" />
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Options */}
            <div className="mt-3.5 space-y-1.5">
              <button
                onClick={() => handleNavClick('catalogo', 'VENTA')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeOperation === 'VENTA'
                    ? 'bg-[#EBF7E8] text-[#48A82D] border border-[#48A82D]/30'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-[#48A82D]" />
                  <span>Venta</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <button
                onClick={() => handleNavClick('catalogo', 'ALQUILER')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeOperation === 'ALQUILER'
                    ? 'bg-[#EBF7E8] text-[#48A82D] border border-[#48A82D]/30'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#48A82D]" />
                  <span>Alquiler</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <button
                onClick={() => handleNavClick('catalogo', 'LOTES')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeOperation === 'LOTES'
                    ? 'bg-[#EBF7E8] text-[#48A82D] border border-[#48A82D]/30'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#48A82D]" />
                  <span>Lotes y Terrenos</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <button
                onClick={() => handleNavClick('contacto')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#48A82D]" />
                  <span>Contacto</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>

            {/* Footer text */}
            <div className="mt-3.5 pt-2.5 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400 text-center font-medium">
                María Eugenia Fernández · Negocios Inmobiliarios
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
