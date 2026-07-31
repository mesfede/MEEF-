import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, LocateFixed, Check, AlertCircle } from 'lucide-react';

interface LocationPickerMapProps {
  lat: number | '';
  lng: number | '';
  onChange: (lat: number, lng: number) => void;
  address?: string;
  city?: string;
}

const DEFAULT_LAT = -37.2483;
const DEFAULT_LNG = -61.2656;

// Custom Leaflet pin icon using clean styled HTML/SVG
const pinHtml = `
  <div style="position: relative; top: -16px; left: -16px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background-color: #48A82D; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 14px rgba(0,0,0,0.4); cursor: grab;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>
`;

const customPinIcon = L.divIcon({
  className: 'custom-location-pin',
  html: pinHtml,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onChange,
  address = '',
  city = 'General La Madrid',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const currentLat = typeof lat === 'number' && !isNaN(lat) ? lat : DEFAULT_LAT;
  const currentLng = typeof lng === 'number' && !isNaN(lng) ? lng : DEFAULT_LNG;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Create initial draggable marker
      const marker = L.marker([currentLat, currentLng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      // On map click: move marker and trigger onChange
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = Number(e.latlng.lat.toFixed(6));
        const newLng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([newLat, newLng]);
        onChange(newLat, newLng);
      });

      // On marker drag end: trigger onChange
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        const newLat = Number(position.lat.toFixed(6));
        const newLng = Number(position.lng.toFixed(6));
        onChange(newLat, newLng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Ensure proper tile rendering when container finishes layout
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Sync map center & marker when lat/lng props change from outside
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const activeLat = typeof lat === 'number' && !isNaN(lat) ? lat : DEFAULT_LAT;
      const activeLng = typeof lng === 'number' && !isNaN(lng) ? lng : DEFAULT_LNG;
      const curPos = markerRef.current.getLatLng();

      if (Math.abs(curPos.lat - activeLat) > 0.00001 || Math.abs(curPos.lng - activeLng) > 0.00001) {
        markerRef.current.setLatLng([activeLat, activeLng]);
        mapInstanceRef.current.panTo([activeLat, activeLng]);
      }
    }
  }, [lat, lng]);

  // Handle Geocoding Search (Address -> Lat/Lng)
  const handleSearchAddressOnMap = async () => {
    const fullQuery = [address, city, 'Buenos Aires', 'Argentina'].filter(Boolean).join(', ');
    if (!fullQuery.trim()) return;

    setIsSearching(true);
    setSearchMessage(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const foundLat = Number(parseFloat(data[0].lat).toFixed(6));
        const foundLng = Number(parseFloat(data[0].lon).toFixed(6));
        onChange(foundLat, foundLng);

        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([foundLat, foundLng]);
          mapInstanceRef.current.setView([foundLat, foundLng], 16);
        }
        setSearchMessage('¡Ubicación encontrada e introducida!');
      } else {
        setSearchMessage('No se encontró el punto exacto. Podés hacer clic en el mapa para ubicarlo manualmente.');
      }
    } catch (error) {
      console.warn('Geocoding search failed:', error);
      setSearchMessage('Error al consultar el mapa. Hacé clic en el mapa para ubicar el pin.');
    } finally {
      setIsSearching(false);
      setTimeout(() => setSearchMessage(null), 5000);
    }
  };

  // Handle Current GPS Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchMessage('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = Number(pos.coords.latitude.toFixed(6));
        const userLng = Number(pos.coords.longitude.toFixed(6));
        onChange(userLat, userLng);

        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([userLat, userLng]);
          mapInstanceRef.current.setView([userLat, userLng], 17);
        }
        setIsLocating(false);
        setSearchMessage('Ubicación GPS detectada correctamente.');
        setTimeout(() => setSearchMessage(null), 4000);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setSearchMessage('No se pudo obtener el GPS. Hacé clic directamente en el mapa.');
        setTimeout(() => setSearchMessage(null), 4000);
      }
    );
  };

  return (
    <div className="space-y-2 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
          <MapPin className="w-3.5 h-3.5 text-[#48A82D]" />
          <span>Seleccionar en el Mapa (Clic o arrastrá el pin)</span>
        </div>

        <div className="flex items-center gap-2">
          {(address || city) && (
            <button
              type="button"
              onClick={handleSearchAddressOnMap}
              disabled={isSearching}
              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Buscar la dirección en el mapa"
            >
              <Search className="w-3 h-3" />
              <span>{isSearching ? 'Buscando...' : 'Buscar dirección'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-2.5 py-1 text-[11px] font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Usar mi ubicación GPS actual"
          >
            <LocateFixed className="w-3 h-3 text-[#48A82D]" />
            <span>{isLocating ? 'Obteniendo GPS...' : 'Mi ubicación'}</span>
          </button>
        </div>
      </div>

      {searchMessage && (
        <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-white flex items-center gap-2 transition-all">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{searchMessage}</span>
        </div>
      )}

      {/* Interactive Leaflet Container */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-zinc-300 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-600 shadow-xs border border-zinc-200/80 pointer-events-none z-[400]">
          Hacé clic o arrastrá el pin verde para actualizar latitud/longitud
        </div>
      </div>
    </div>
  );
};
