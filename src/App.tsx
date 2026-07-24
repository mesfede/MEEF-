import React, { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Map, SlidersHorizontal, ArrowUpDown, Phone, MessageSquare, Calculator, Heart, Sparkles, Building2, Trees, DollarSign, RotateCcw } from 'lucide-react';
import { Property, SearchFilters, OperationType, PropertyType } from './types';
import { PROPERTIES_DATA } from './data/properties';
import { subscribeToProperties, deletePropertyFromFirestore } from './services/propertyService';
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

export default function App() {
  // Global Realtime Properties State from Firebase
  const [properties, setProperties] = useState<Property[]>(PROPERTIES_DATA);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

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
  const [favorites, setFavorites] = useState<string[]>(['mef-101', 'mef-102']);
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
      setProperties((prev) => {
        const index = prev.findIndex((p) => p.id === savedProp.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = savedProp;
          return updated;
        }
        return [savedProp, ...prev];
      });
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

  // Search Filters State
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

  // Update filters handler
  const handleUpdateFilters = (updated: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Toggle Favorite Handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
      // Default: recent
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  }, [filters, properties]);

  const favoritePropertiesList = useMemo(() => {
    return properties.filter((p) => favorites.includes(p.id));
  }, [favorites, properties]);

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
        />
      )}

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
          scrollToSection('propiedades');
        }}
        onScrollToSection={scrollToSection}
        onOpenAdminLogin={handleAdminTrigger}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main className="flex-1">
        {/* 2. HERO SEARCH ENGINE */}
        <div id="hero">
          <HeroSearch
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onOpenAdvancedFilters={() => setFilterModalOpen(true)}
            totalResultsCount={filteredProperties.length}
            onSearchSubmit={() => scrollToSection('propiedades')}
            onOpenMapView={() => setGoogleMapsModalOpen(true)}
          />
        </div>

        {/* 3. MAIN PROPERTIES LISTING SECTION */}
        <section id="propiedades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* RECENTLY UPLOADED SPOTLIGHT FEATURE */}
          <RecentSpotlight
            properties={properties}
            currency={currency}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />

          {/* SECTION HEADER BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
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
                Mostrando <strong className="text-zinc-900">{filteredProperties.length}</strong> resultados de alta calidad
              </p>
            </div>

            {/* CONTROLS: Operation Switcher, View Mode, Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Operation Pills */}
              <div className="bg-zinc-200/70 p-1 rounded-xl flex gap-1">
                {(['TODAS', 'VENTA', 'ALQUILER', 'LOTES'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => handleUpdateFilters({ operation: op })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filters.operation === op
                        ? 'bg-[#181818] text-white shadow-xs'
                        : 'text-zinc-700 hover:text-zinc-900'
                    }`}
                  >
                    {op === 'TODAS' ? 'Todas' : op}
                  </button>
                ))}
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
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 p-8 space-y-4">
              <div className="w-16 h-16 bg-[#48A82D]/10 text-[#48A82D] rounded-2xl flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">
                No encontramos propiedades con los filtros seleccionados
              </h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Invertí o ampliá tus criterios de búsqueda (como zona, rango de precio o amenities) para explorar nuestro catálogo completo.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#48A82D] text-white font-bold rounded-xl text-xs hover:bg-[#3C8F24] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ver todas las propiedades</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProperties.map((property) => (
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
                />
              ))}
            </div>
          ) : (
            <MapView
              properties={filteredProperties}
              currency={currency}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          )}
        </section>

        {/* 4. BRAND VALUES & ABOUT SECTION */}
        <AboutSection />
      </main>

      {/* 5. FOOTER */}
      <Footer
        onSelectOperation={(op) => {
          handleUpdateFilters({ operation: op });
          scrollToSection('propiedades');
        }}
        onOpenValuationModal={() => setValuationModalOpen(true)}
        onOpenAdminLogin={handleAdminTrigger}
      />

      {/* FLOATING WHATSAPP CTA BUTTON */}
      <a
        href="https://wa.me/5491155218899?text=Hola%20MARIA%20EUGENIA%20FERNÁNDEZ%20Inmobiliaria,%20quisiera%20hacer%20una%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#48A82D] hover:bg-[#3C8F24] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center border-2 border-white group"
        title="Consultar por WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-white text-[#48A82D]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          Consultar por WhatsApp
        </span>
      </a>

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
