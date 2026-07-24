import React, { useState } from 'react';
import { Phone, Heart, Menu, X, Calculator, ArrowUpRight, Shield } from 'lucide-react';
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
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  currency,
  onToggleCurrency,
  onOpenFavorites,
  onOpenValuationModal,
  activeOperation,
  onSelectOperation,
  onScrollToSection,
  onOpenAdminLogin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, op?: OperationType | 'TODAS') => {
    if (op !== undefined) {
      onSelectOperation(op);
    }
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
      {/* Top Bar for contact & info */}
      <div className="bg-[#181818] text-gray-200 text-xs py-2 px-4 sm:px-8 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <span className="hidden sm:inline-flex items-center text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#48A82D] mr-2 animate-pulse"></span>
            Atención personalizada en General La Madrid y la región
          </span>
          <a
            href="tel:+5491155218899"
            className="hover:text-[#48A82D] transition-colors flex items-center gap-1.5 font-medium text-white"
          >
            <Phone className="w-3.5 h-3.5 text-[#48A82D]" />
            <span>+54 9 11 5521-8899</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://wa.me/5491155218899?text=Hola%20MEF%20Negocios%20Inmobiliarios,%20quisiera%20hacer%20una%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#48A82D] hover:text-green-400 font-semibold flex items-center gap-1 text-[11px] transition-colors"
          >
            <span>WhatsApp Directo</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {isAdminLoggedIn && onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#48A82D] text-white transition-all cursor-pointer"
              title="Panel Admin"
            >
              <Shield className="w-3 h-3 text-white" />
              <span>Panel Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        {/* LOGO: MARIA EUGENIA FERNÁNDEZ NEGOCIOS INMOBILIARIOS */}
        <div 
          onClick={() => handleNavClick('hero', 'TODAS')}
          className="cursor-pointer group py-1 shrink-0"
        >
          <Logo size="md" variant="dark" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => handleNavClick('propiedades', 'VENTA')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              activeOperation === 'VENTA'
                ? 'text-[#48A82D] bg-[#EBF7E8] border-b-2 border-[#48A82D]'
                : 'text-zinc-800 hover:text-[#48A82D] hover:bg-zinc-50'
            }`}
          >
            Ventas
          </button>

          <button
            onClick={() => handleNavClick('propiedades', 'ALQUILER')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer ${
              activeOperation === 'ALQUILER'
                ? 'text-[#48A82D] bg-[#EBF7E8] border-b-2 border-[#48A82D]'
                : 'text-zinc-800 hover:text-[#48A82D] hover:bg-zinc-50'
            }`}
          >
            Alquileres
          </button>

          <button
            onClick={() => handleNavClick('propiedades', 'LOTES')}
            className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer relative ${
              activeOperation === 'LOTES'
                ? 'text-[#48A82D] bg-[#EBF7E8] border-b-2 border-[#48A82D]'
                : 'text-zinc-800 hover:text-[#48A82D] hover:bg-zinc-50'
            }`}
          >
            Lotes y Terrenos
            <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-[#48A82D] text-white px-1.5 py-0.2 rounded-full shadow-xs">
              Especial
            </span>
          </button>

          <button
            onClick={() => handleNavClick('nosotros')}
            className="px-3.5 py-2 text-sm font-medium text-zinc-700 hover:text-[#48A82D] hover:bg-zinc-50 rounded-md transition-all cursor-pointer"
          >
            Nosotros
          </button>

          <button
            onClick={() => handleNavClick('contacto')}
            className="px-3.5 py-2 text-sm font-medium text-zinc-700 hover:text-[#48A82D] hover:bg-zinc-50 rounded-md transition-all cursor-pointer"
          >
            Contacto
          </button>
        </nav>

        {/* Right Action CTA Buttons */}
        <div className="flex items-center space-x-3">
          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2.5 text-zinc-700 hover:text-[#48A82D] hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
            title="Ver Propiedades Guardadas"
          >
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-[#48A82D] fill-[#48A82D]' : 'text-zinc-700'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#48A82D] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Tasar Propiedad CTA */}
          <button
            onClick={onOpenValuationModal}
            className="hidden sm:inline-flex items-center gap-2 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm border border-zinc-700 hover:border-[#48A82D] transition-all cursor-pointer group"
          >
            <Calculator className="w-4 h-4 text-[#48A82D] group-hover:scale-110 transition-transform" />
            <span>Tasar Propiedad</span>
          </button>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-800 hover:text-[#48A82D] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-gray-100">
            <button
              onClick={() => handleNavClick('propiedades', 'VENTA')}
              className={`py-2 text-center text-xs font-semibold rounded-md border ${
                activeOperation === 'VENTA'
                  ? 'bg-[#48A82D] text-white border-[#48A82D]'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              Ventas
            </button>
            <button
              onClick={() => handleNavClick('propiedades', 'ALQUILER')}
              className={`py-2 text-center text-xs font-semibold rounded-md border ${
                activeOperation === 'ALQUILER'
                  ? 'bg-[#48A82D] text-white border-[#48A82D]'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              Alquiler
            </button>
            <button
              onClick={() => handleNavClick('propiedades', 'LOTES')}
              className={`py-2 text-center text-xs font-semibold rounded-md border ${
                activeOperation === 'LOTES'
                  ? 'bg-[#48A82D] text-white border-[#48A82D]'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              Lotes
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => handleNavClick('nosotros')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 rounded-md"
            >
              Sobre Nosotros
            </button>
            <button
              onClick={() => handleNavClick('contacto')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 rounded-md"
            >
              Ubicación y Contacto
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenValuationModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#181818] text-white py-2.5 rounded-lg text-xs font-semibold border border-zinc-700"
            >
              <Calculator className="w-4 h-4 text-[#48A82D]" />
              <span>Solicitar Tasación Gratuita</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
