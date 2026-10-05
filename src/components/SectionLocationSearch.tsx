import React, { useState, useRef, useEffect } from 'react';
import { Search, Crosshair, MapPin, ChevronRight, X } from 'lucide-react';
import { HydroStation, PincodeEntry } from '../types';
import { DISTRICTS, TRIPURA_PINCODES, calculateDistanceKm } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface SectionLocationSearchProps {
  stations: HydroStation[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onSelectStation: (station: HydroStation) => void;
  onDropPin: (coords: { lat: number; lng: number }) => void;
  onLocateGps: () => void;
  isLocating: boolean;
}

export const SectionLocationSearch: React.FC<SectionLocationSearchProps> = ({
  stations,
  selectedDistrict,
  onSelectDistrict,
  onSelectStation,
  onDropPin,
  onLocateGps,
  isLocating,
}) => {
  const { t, getDistrictName } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Matched stations
  const matchedStations = cleanQuery.length > 0
    ? stations.filter((st) => (
        st.location.toLowerCase().includes(cleanQuery) ||
        st.village.toLowerCase().includes(cleanQuery) ||
        st.pincode.includes(cleanQuery) ||
        st.block.toLowerCase().includes(cleanQuery) ||
        st.district.toLowerCase().includes(cleanQuery) ||
        st.post_office.toLowerCase().includes(cleanQuery)
      )).slice(0, 6)
    : [];

  // Matched PIN codes
  const matchedPincodes = cleanQuery.length > 0
    ? TRIPURA_PINCODES.filter((p) => (
        p.pincode.includes(cleanQuery) ||
        p.post_office.toLowerCase().includes(cleanQuery) ||
        p.district.toLowerCase().includes(cleanQuery) ||
        p.block.toLowerCase().includes(cleanQuery) ||
        p.villages.some((v) => v.toLowerCase().includes(cleanQuery))
      )).slice(0, 4)
    : [];

  const handleSelectStation = (st: HydroStation) => {
    onSelectStation(st);
    setQuery(`${st.location} (${st.pincode})`);
    setIsOpen(false);
    // Smooth scroll to Overview or Map
    const el = document.getElementById('section-overview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPincode = (p: PincodeEntry) => {
    let nearest = stations[0];
    let minDistance = Infinity;
    stations.forEach((st) => {
      const dist = calculateDistanceKm(p.lat, p.lng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = st;
      }
    });

    onSelectStation(nearest);
    onDropPin({ lat: p.lat, lng: p.lng });
    setQuery(`${p.post_office} (${p.pincode})`);
    setIsOpen(false);

    const el = document.getElementById('section-overview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedPincodes.length > 0) {
        handleSelectPincode(matchedPincodes[0]);
      } else if (matchedStations.length > 0) {
        handleSelectStation(matchedStations[0]);
      }
    }
  };

  return (
    <section
      id="section-search"
      className="relative min-h-[560px] py-24 px-4 sm:px-6 flex items-center justify-center overflow-hidden"
    >
      {/* 1. Full-Width Heritage Photograph Background: Neermahal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={IMAGES.neermahalTripuraWater}
          alt="Neermahal Water Palace, Rudrasagar Lake, Tripura"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.05]"
        />
        {/* Soft translucent gradient overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/80 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. Clean Centered Search Composition */}
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        {/* Subtle Water Identity Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sky-200 text-xs font-semibold mb-4">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Tripura Hydrogeological Network</span>
        </div>

        {/* Clean Headline & Subtitle */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          Find Your Location
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto font-normal">
          Search a PIN, village, or monitoring station to unlock groundwater conditions.
        </p>

        {/* ONE Large Search Field with Locate Me */}
        <div ref={containerRef} className="mt-8 relative max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/30 shadow-2xl">
            {/* Input with Search Icon */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 absolute left-4 pointer-events-none" />
              <input
                id="station-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search Station / PIN (e.g., 799001, Agartala, Bishalgarh)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl text-sm sm:text-base font-medium bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Locate Me Button */}
            <button
              type="button"
              onClick={onLocateGps}
              disabled={isLocating}
              className="px-5 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isOpen && (matchedStations.length > 0 || matchedPincodes.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-left">
              {matchedStations.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Observation Stations
                  </div>
                  {matchedStations.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectStation(st)}
                      className="w-full px-3 py-2.5 rounded-xl text-left hover:bg-sky-50 dark:hover:bg-sky-950/50 flex items-center justify-between transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <WaterDropIcon className="w-4 h-4 text-sky-500 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                            {st.location}
                          </div>
                          <div className="text-xs text-slate-500">
                            {st.district} District • PIN {st.pincode} • Level: {st.pre_depth.toFixed(1)}m
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500" />
                    </button>
                  ))}
                </div>
              )}

              {matchedPincodes.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    PIN Code Directories
                  </div>
                  {matchedPincodes.map((p) => (
                    <button
                      key={p.pincode}
                      type="button"
                      onClick={() => handleSelectPincode(p)}
                      className="w-full px-3 py-2.5 rounded-xl text-left hover:bg-sky-50 dark:hover:bg-sky-950/50 flex items-center justify-between transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600">
                            {p.post_office} — PIN {p.pincode}
                          </div>
                          <div className="text-xs text-slate-500">
                            {p.block}, {p.district}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Small District Selector Pills Below */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto">
          <span className="text-xs text-slate-300 font-medium mr-1">Filter by District:</span>
          {DISTRICTS.map((distId) => {
            const isSelected = selectedDistrict === distId;
            return (
              <button
                key={distId}
                type="button"
                onClick={() => onSelectDistrict(distId)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                {distId === 'ALL' ? 'All Districts' : getDistrictName(distId)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
