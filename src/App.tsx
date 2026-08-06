import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { LayoutGrid, Map, SlidersHorizontal, ArrowUpDown, Phone, MessageSquare, Calculator, Heart, Sparkles, Building2, Trees, DollarSign, RotateCcw, ChevronLeft, ChevronRight, AlertTriangle, Upload, Plus } from 'lucide-react';
import { Property, SearchFilters, OperationType, PropertyType } from './types';
import { getAssetUrl } from './lib/utils';

import {
  subscribeToProperties,
  deletePropertyFromFirestore,
  updatePropertyInFirestore,
  updatePropertiesOrder,
  exportPropertiesBackupJSON,
  importPropertiesBackupJSON,
  syncAllLocalToFirestore,
} from './services/propertyService';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { FilterModal } from './components/FilterModal';
import { TasacionModal } from './components/TasacionModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { MapView } from './components/MapView';
import { GoogleMapsModal } from './components/GoogleMapsModal';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { RecentSpotlight } from './components/RecentSpotlight';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPropertyModal } from './components/AdminPropertyModal';
import mapBgImage from './assets/map-bg.jpg';

export default function App() {
  // Hero Video Ref & Autoplay Guarantee
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isAtFooter, setIsAtFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to detect when user reaches the footer
  useEffect(() => {
    const footerEl = document.getElementById('contacto');
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtFooter(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playVideo = () => {
        video.play().catch(() => {});
      };
      playVideo();

      // Seamless video loop handler: resets 150ms before end to avoid HTML5 video loop micro-stutters
      const handleTimeUpdate = () => {
        if (video.duration > 0 && video.currentTime >= video.duration - 0.15) {
          video.currentTime = 0.01;
          video.play().catch(() => {});
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      const handleUserInteraction = () => {
        if (video.paused) {
          playVideo();
        }
      };

      window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
      window.addEventListener('click', handleUserInteraction, { passive: true, once: true });

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('click', handleUserInteraction);
      };
    }
  }, []);

  // Global Realtime Properties State from Firebase
  const [properties, setProperties] = useState<Property[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Admin Auth & Modal States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mef_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('mef_admin_email') || 'admin@mefnegociosinmobiliarios.ar';
    } catch {
      return 'admin@mefnegociosinmobiliarios.ar';
    }
  });
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [adminPropertyModalOpen, setAdminPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  // Global UI State
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mef_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [valuationModalOpen, setValuationModalOpen] = useState(false);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const [googleMapsModalOpen, setGoogleMapsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Realtime subscription to Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProperties((liveProperties, fromFirebase) => {
      setProperties(liveProperties);
      setIsFirebaseConnected(fromFirebase);
    });
    return () => unsubscribe();
  }, []);

  // Admin Auth Handlers
  const handleOpenAddProperty = () => {
    setPropertyToEdit(null);
    setAdminPropertyModalOpen(true);
  };

  const handleLoginSuccess = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    try {
      localStorage.setItem('mef_admin_logged_in', 'true');
      localStorage.setItem('mef_admin_email', email);
    } catch (e) {
      console.warn('localStorage setItem blocked:', e);
    }
    // Automatically open the property form upon successful login
    handleOpenAddProperty();
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('mef_admin_logged_in');
      localStorage.removeItem('mef_admin_email');
    } catch (e) {
      console.warn('localStorage removeItem blocked:', e);
    }
  };

  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      handleOpenAddProperty();
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const handleEditProperty = (property: Property) => {
    setPropertyToEdit(property);
    setAdminPropertyModalOpen(true);
  };

  const handlePropertySaved = (savedProp?: Property) => {
    if (savedProp) {
      // 1. Reset filters to ensure the newly saved property is not hidden by active filters
      setFilters((prev) => ({
        ...prev,
        operation: 'TODAS',
        propertyType: 'TODOS',
        zone: 'Todas las zonas',
        refCodeSearch: '',
      }));

      // 2. Add or update property at the top of state
      setProperties((prev) => {
        const filtered = prev.filter((p) => p.id !== savedProp.id && p.refCode !== savedProp.refCode);
        return [savedProp, ...filtered];
      });

      // 3. Scroll to catalog so user sees the newly saved property immediately
      setTimeout(() => {
        scrollToSection('catalogo');
      }, 100);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    // Optimistically update local React state immediately so item is removed from view
    setProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await deletePropertyFromFirestore(id);
    } catch (err: any) {
      console.warn('Notice deleting property from Firestore:', err);
    }
  };

  // Search Filters State & Pagination State
  const defaultFilters: SearchFilters = {
    operation: 'TODAS',
    propertyType: 'TODOS',
    zone: 'Todas las zonas',
    minPrice: 0,
    maxPrice: 2000000,
    currency: 'USD',
    minBedrooms: 0,
    minBathrooms: 0,
    minCoveredArea: 0,
    amenities: [],
    onlyFeatured: false,
    onlyWithVideo: false,
    onlyRecentlyUploaded: false,
    refCodeSearch: '',
    sortBy: 'recent',
  };

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Reordering functions for Admin
  const handleMovePropertyUp = async (id: string) => {
    const currentList = filteredProperties;
    const idx = currentList.findIndex((p) => p.id === id);
    if (idx <= 0) return;
    
    const newFiltered = [...currentList];
    const temp = newFiltered[idx];
    newFiltered[idx] = newFiltered[idx - 1];
    newFiltered[idx - 1] = temp;
    
    const filteredIds = new Set(newFiltered.map((p) => p.id));
    const nonFiltered = properties.filter((p) => !filteredIds.has(p.id));
    
    const newFullList = [...newFiltered, ...nonFiltered];
    const updatedProperties = newFullList.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
    
    setProperties(updatedProperties);
    await updatePropertiesOrder(updatedProperties.map((p) => ({ id: p.id, displayOrder: p.displayOrder! })));
  };

  const handleMovePropertyDown = async (id: string) => {
    const currentList = filteredProperties;
    const idx = currentList.findIndex((p) => p.id === id);
    if (idx < 0 || idx >= currentList.length - 1) return;
    
    const newFiltered = [...currentList];
    const temp = newFiltered[idx];
    newFiltered[idx] = newFiltered[idx + 1];
    newFiltered[idx + 1] = temp;
    
    const filteredIds = new Set(newFiltered.map((p) => p.id));
    const nonFiltered = properties.filter((p) => !filteredIds.has(p.id));
    
    const newFullList = [...newFiltered, ...nonFiltered];
    const updatedProperties = newFullList.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
    
    setProperties(updatedProperties);
    await updatePropertiesOrder(updatedProperties.map((p) => ({ id: p.id, displayOrder: p.displayOrder! })));
  };

  // Update filters handler
  const handleUpdateFilters = (updated: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Toggle Favorite Handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('mef_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save favorites to localStorage:', e);
      }
      return updated;
    });
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // FILTER LOGIC
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Operation filter
      if (filters.operation !== 'TODAS' && p.operation !== filters.operation) {
        return false;
      }

      // Property type filter
      if (filters.propertyType !== 'TODOS' && p.type !== filters.propertyType) {
        return false;
      }

      // Zone filter
      if (filters.zone !== 'Todas las zonas' && !p.location.zone.toLowerCase().includes(filters.zone.toLowerCase())) {
        return false;
      }

      // Price filter (compared in USD)
      if (p.priceUSD < filters.minPrice) return false;
      if (filters.maxPrice < 2000000 && p.priceUSD > filters.maxPrice) return false;

      // Bedrooms
      if (filters.minBedrooms > 0 && p.bedrooms < filters.minBedrooms) return false;

      // Bathrooms
      if (filters.minBathrooms > 0 && p.bathrooms < filters.minBathrooms) return false;

      // Covered Area
      if (filters.minCoveredArea > 0 && p.coveredArea < filters.minCoveredArea) return false;

      // Only with video
      if (filters.onlyWithVideo && !p.videoUrl) return false;

      // Only recently uploaded
      if (filters.onlyRecentlyUploaded && !p.isRecentlyUploaded) return false;

      // Ref code or keyword search
      if (filters.refCodeSearch.trim() !== '') {
        const query = filters.refCodeSearch.toLowerCase().trim();
        const matchesRef = p.refCode.toLowerCase().includes(query);
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesZone = p.location.zone.toLowerCase().includes(query);
        if (!matchesRef && !matchesTitle && !matchesDesc && !matchesZone) return false;
      }

      // Amenities checklist
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((a) => p.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return (a.priceUSD || 0) - (b.priceUSD || 0);
      if (filters.sortBy === 'price-desc') return (b.priceUSD || 0) - (a.priceUSD || 0);
      if (filters.sortBy === 'area-desc') return (b.totalArea || 0) - (a.totalArea || 0);
      // Default: recent (respect displayOrder if present, otherwise createdAt timestamp)
      if (a.displayOrder !== undefined || b.displayOrder !== undefined) {
        const orderA = a.displayOrder !== undefined ? a.displayOrder : 999999;
        const orderB = b.displayOrder !== undefined ? b.displayOrder : 999999;
        if (orderA !== orderB) return orderA - orderB;
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const diff = (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      if (diff !== 0) return diff;
      const isCustomA = !a.id.startsWith('mef-10');
      const isCustomB = !b.id.startsWith('mef-10');
      if (isCustomA && !isCustomB) return -1;
      if (!isCustomA && isCustomB) return 1;
      return 0;
    });
  }, [filters, properties]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToSection('catalogo');
    }
  };

  const favoritePropertiesList = useMemo(() => {
    return properties.filter((p) => favorites.includes(p.id));
  }, [favorites, properties]);

  const handleSyncToFirebase = async () => {
    try {
      const count = await syncAllLocalToFirestore();
      alert(`¡Se han sincronizado ${count} propiedades a la base de datos de Firebase!`);
    } catch (err: any) {
      alert(`Error al sincronizar con Firebase: ${err?.message || 'No se pudo conectar.'}`);
      throw err;
    }
  };

  const handleExportBackup = () => {
    exportPropertiesBackupJSON(properties);
  };

  const handleImportBackup = async (file: File) => {
    try {
      const text = await file.text();
      const count = await importPropertiesBackupJSON(text);
      alert(`Se restauraron/importaron ${count} propiedades a su catálogo correctamente.`);
    } catch (err: any) {
      alert(`Error al procesar el archivo de backup: ${err.message}`);
    }
  };

  // Vintage period film LUT (35mm Kodachrome / Technicolor) tuned for historic town architecture, warm terracotta tones, and luminous bright skies
  const scrollRatio = Math.min(1, scrollY / 300);
  const vintageFactor = 1 - scrollRatio;
  const grayscalePercent = Math.round(scrollRatio * 100);
  const videoFilter = `grayscale(${grayscalePercent}%) sepia(${Math.round(32 * vintageFactor)}%) contrast(${Math.round(102 + 22 * vintageFactor)}%) saturate(${Math.round(105 + 40 * vintageFactor)}%) hue-rotate(${Math.round(-10 * vintageFactor)}deg) brightness(${Math.round(110 + 6 * vintageFactor)}%)`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ADMIN TOP TOOLBAR (Visible when logged in) */}
      {isAdminLoggedIn && (
        <AdminBar
          adminEmail={adminEmail}
          onOpenAddProperty={handleOpenAddProperty}
          onLogout={handleLogoutAdmin}
          isFirebaseActive={isFirebaseConnected}
          totalPropertiesCount={properties.length}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onSyncFirebase={handleSyncToFirebase}
        />
      )}

      {/* HERO SECTION WITH BACKGROUND DRONE VIDEO SPANNING HEADER & SEARCH */}
      <div id="hero" className={`relative bg-[#121212] text-white overflow-hidden min-h-[100dvh] flex flex-col justify-between ${isAdminLoggedIn ? 'pt-[52px]' : ''}`}>
        {/* Full-span Background Drone Video Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-zinc-950">
          <img
            src={getAssetUrl('/mef-logo-white.png')}
            alt="Loading..."
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-auto object-contain opacity-50 z-0"
          />
          <video
            ref={heroVideoRef}
            src={getAssetUrl('/hero-video.mp4')}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              filter: videoFilter,
              willChange: 'filter, transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
            onLoadedData={(e) => {
              e.currentTarget.style.display = 'block';
            }}
            onError={(e) => {
              // Gracefully handle video loading errors without breaking React UI
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover object-top z-1"
          />
          {/* Vintage cinematic overlay gradient: luminous soft sky glow at top for clear open skies, fading to smooth subtle vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/16 via-transparent to-black/40 pointer-events-none z-2" />
        </div>

        {/* 1. HEADER */}
          <Header
            favoritesCount={favorites.length}
            currency={currency}
            onToggleCurrency={() => setCurrency((prev) => (prev === 'USD' ? 'ARS' : 'USD'))}
            onOpenFavorites={() => setFavoritesDrawerOpen(true)}
            onOpenValuationModal={() => setValuationModalOpen(true)}
            activeOperation={filters.operation}
            onSelectOperation={(op) => {
              handleUpdateFilters({ operation: op });
              scrollToSection('catalogo');
            }}
            onScrollToSection={scrollToSection}
            onOpenAdminLogin={handleAdminTrigger}
            isAdminLoggedIn={isAdminLoggedIn}
            onMenuToggle={setIsMenuOpen}
          />

        {/* 2. HERO SEARCH ENGINE */}
        <div className="relative z-10 flex-1 flex items-end sm:items-center justify-center pb-2 sm:py-12">
          <HeroSearch
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            totalResultsCount={filteredProperties.length}
            onSearchSubmit={() => scrollToSection('catalogo')}
            onOpenMapView={() => setGoogleMapsModalOpen(true)}
          />
        </div>
      </div>

      <main className="flex-1 relative bg-zinc-50 overflow-hidden">
        {/* Map Watermark Background - strictly contained within main catalog section */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-80 sm:opacity-85 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: `url(${mapBgImage})`
          }}
        />
        <div className="relative z-10">
        {/* 3. MAIN PROPERTIES LISTING SECTION */}
        <section id="propiedades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* RECENTLY UPLOADED SPOTLIGHT FEATURE */}
          <RecentSpotlight
            properties={properties}
            currency={currency}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />

          {/* SECTION HEADER BAR */}
          <div id="catalogo" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#48A82D]"></span>
                <span className="text-xs font-bold text-[#48A82D] uppercase tracking-widest">
                  Catálogo Inmobiliario
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">
                {filters.operation === 'TODAS'
                  ? 'Todas las Propiedades'
                  : filters.operation === 'VENTA'
                  ? 'Propiedades en Venta'
                  : filters.operation === 'ALQUILER'
                  ? 'Propiedades en Alquiler'
                  : 'Lotes y Terrenos Exclusivos'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Mostrando <strong className="text-zinc-900">{filteredProperties.length}</strong> resultados
              </p>
            </div>

            {/* CONTROLS: Operation Switcher, View Mode, Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Operation Pills */}
              <div className="bg-zinc-200/80 p-1.5 sm:p-2 rounded-2xl flex gap-1.5 sm:gap-2 shadow-xs">
                {(['TODAS', 'VENTA', 'ALQUILER', 'LOTES'] as const).map((op) => {
                  let activeClass = 'bg-[#181818] text-white shadow-md';
                  if (op === 'VENTA') activeClass = 'bg-black text-white shadow-md';
                  if (op === 'ALQUILER') activeClass = 'bg-zinc-500 text-white shadow-md';
                  if (op === 'LOTES') activeClass = 'bg-[#48A82D] text-white shadow-md';

                  return (
                    <button
                      key={op}
                      onClick={() => handleUpdateFilters({ operation: op })}
                      className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
                        filters.operation === op
                          ? activeClass
                          : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-300/50'
                      }`}
                    >
                      {op === 'TODAS' ? 'Todas' : op}
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle (Grid vs Map) */}
              <div className="bg-zinc-200/70 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#48A82D] shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                  title="Vista de Cuadrícula"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGoogleMapsModalOpen(true)}
                  className="p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-zinc-600 hover:text-[#48A82D] hover:bg-white"
                  title="Abrir Google Maps"
                >
                  <Map className="w-4 h-4 text-[#48A82D]" />
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-zinc-300 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#48A82D]" />
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleUpdateFilters({
                      sortBy: e.target.value as 'recent' | 'price-asc' | 'price-desc' | 'area-desc',
                    })
                  }
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="recent">Más Recientes</option>
                  <option value="price-asc">Menor Precio</option>
                  <option value="price-desc">Mayor Precio</option>
                  <option value="area-desc">Mayor Superficie</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          {(filters.propertyType !== 'TODOS' ||
            filters.zone !== 'Todas las zonas' ||
            filters.minPrice > 0 ||
            filters.maxPrice < 2000000 ||
            filters.refCodeSearch ||
            filters.onlyWithVideo ||
            filters.onlyRecentlyUploaded ||
            filters.amenities.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-zinc-500 font-semibold">Filtros activos:</span>
              {filters.onlyWithVideo && (
                <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-md border border-rose-300">
                  📹 Con Video Tour
                </span>
              )}
              {filters.onlyRecentlyUploaded && (
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md border border-amber-300">
                  🔥 Recién Subidas
                </span>
              )}
              {filters.propertyType !== 'TODOS' && (
                <span className="text-xs bg-[#48A82D]/10 text-[#48A82D] font-semibold px-2.5 py-1 rounded-md border border-[#48A82D]/30">
                  {filters.propertyType}
                </span>
              )}
              {filters.zone !== 'Todas las zonas' && (
                <span className="text-xs bg-[#48A82D]/10 text-[#48A82D] font-semibold px-2.5 py-1 rounded-md border border-[#48A82D]/30">
                  {filters.zone}
                </span>
              )}
              {filters.refCodeSearch && (
                <span className="text-xs bg-[#48A82D]/10 text-[#48A82D] font-semibold px-2.5 py-1 rounded-md border border-[#48A82D]/30">
                  "{filters.refCodeSearch}"
                </span>
              )}
              {filters.amenities.map((a) => (
                <span key={a} className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                  {a}
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="text-xs text-zinc-500 hover:text-[#48A82D] underline font-semibold ml-2 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer todo</span>
              </button>
            </div>
          )}

          {/* PROPERTY DISPLAY (GRID OR MAP) */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-5 shadow-sm max-w-2xl mx-auto my-8">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                {properties.length === 0
                  ? 'No hay propiedades en la base de datos'
                  : 'No encontramos la propiedad solicitada'}
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                {properties.length === 0
                  ? 'Las propiedades de ejemplo han sido eliminadas. Puedes importar tu archivo JSON descargado directamente a Firebase Firestore o cargar propiedades nuevas.'
                  : 'Prueba ajustando los filtros de búsqueda o restableciéndolos para ver el catálogo completo.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {properties.length === 0 ? (
                  <>
                    <label className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-all cursor-pointer shadow-md inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Subir archivo JSON a Firebase</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImportBackup(file);
                        }}
                      />
                    </label>
                    <button
                      onClick={handleAdminTrigger}
                      className="px-6 py-3 bg-[#48A82D] text-white font-bold rounded-xl text-xs hover:bg-[#3C8F24] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cargar Propiedad Manualmente</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-[#48A82D] text-white font-bold rounded-xl text-xs hover:bg-[#3C8F24] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ver todas las propiedades</span>
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    currency={currency}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                    isAdmin={isAdminLoggedIn}
                    onEditProperty={handleEditProperty}
                    onDeleteProperty={handleDeleteProperty}
                    onMoveUpProperty={
                      filters.sortBy === 'recent' ? handleMovePropertyUp : undefined
                    }
                    onMoveDownProperty={
                      filters.sortBy === 'recent' ? handleMovePropertyDown : undefined
                    }
                  />
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-200">
                  <div className="text-xs text-zinc-500 font-medium">
                    Página <strong className="text-zinc-900 font-bold">{currentPage}</strong> de{' '}
                    <strong className="text-zinc-900 font-bold">{totalPages}</strong> (Mostrando fichas{' '}
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} de{' '}
                    {filteredProperties.length})
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>

                    {/* Bullet numbers */}
                    <div className="flex items-center gap-1.5 px-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                            currentPage === pageNum
                              ? 'bg-[#48A82D] text-white shadow-md scale-105'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs flex items-center gap-1"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <MapView
              properties={filteredProperties}
              currency={currency}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          )}
        </section>

        {/* VENDER / COMPRAR / TASAR - MÓDULO HERRAMIENTAS Y PUBLICACIÓN */}
        <AboutSection />
      </div>
      </main>

      {/* 5. FOOTER */}
      <Footer
        onSelectOperation={(op) => {
          handleUpdateFilters({ operation: op });
          scrollToSection('catalogo');
        }}
        onOpenValuationModal={() => setValuationModalOpen(true)}
        onOpenAdminLogin={handleAdminTrigger}
      />

      {/* FLOATING WHATSAPP CTA BUTTON */}
      <div 
        className={`fixed bottom-5 left-0 right-0 z-30 pointer-events-none flex justify-end max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${
          isMenuOpen || filterModalOpen || valuationModalOpen || favoritesDrawerOpen || googleMapsModalOpen || selectedProperty || adminLoginModalOpen || adminPropertyModalOpen || scrollY <= 50 || isAtFooter
            ? 'opacity-0 pointer-events-none'
            : 'opacity-30 hover:opacity-100'
        }`}
      >
        <a
          href="https://wa.me/5492284603168?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quisiera%20hacer%20una%20consulta."
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-[#25D366] hover:bg-[#1DA851] text-white p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border border-white/80 group"
          title="Consultar por WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            Consultar por WhatsApp
          </span>
        </a>
      </div>

      {/* MODALS & DRAWERS */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        matchingCount={filteredProperties.length}
      />

      <PropertyDetailModal
        property={selectedProperty}
        currency={currency}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isAdmin={isAdminLoggedIn}
        onEditProperty={handleEditProperty}
      />

      <TasacionModal
        isOpen={valuationModalOpen}
        onClose={() => setValuationModalOpen(false)}
      />

      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favoriteProperties={favoritePropertiesList}
        currency={currency}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      <GoogleMapsModal
        isOpen={googleMapsModalOpen}
        onClose={() => setGoogleMapsModalOpen(false)}
        properties={properties}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* ADMIN MODALS */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminPropertyModal
        isOpen={adminPropertyModalOpen}
        onClose={() => setAdminPropertyModalOpen(false)}
        propertyToEdit={propertyToEdit}
        onSavedSuccess={handlePropertySaved}
      />
    </div>
  );
}
