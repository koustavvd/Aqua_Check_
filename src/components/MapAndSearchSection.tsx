import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Crosshair, Droplets, ArrowDown, ChevronRight, Layers, Compass } from 'lucide-react';
import { HydroStation, PincodeEntry } from '../types';
import { DISTRICTS, TRIPURA_STATIONS, TRIPURA_PINCODES, calculateDistanceKm, calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { HydroMap } from './HydroMap';
import { WaterDropIcon } from './WaterDropIcon';

interface MapAndSearchSectionProps {
  stations: HydroStation[];
  selectedStation: HydroStation | null;
  onSelectStation: (station: HydroStation) => void;
  onClearStation?: () => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  droppedPin: { lat: number; lng: number } | null;
  onDropPin: (coords: { lat: number; lng: number }) => void;
  onClearPin: () => void;
  onLocateGps: () => void;
  isLocating: boolean;
  onViewHydroData: () => void;
}

export const MapAndSearchSection: React.FC<MapAndSearchSectionProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onClearStation,
  selectedDistrict,
  onSelectDistrict,
  droppedPin,
  onDropPin,
  onClearPin,
  onLocateGps,
  isLocating,
  onViewHydroData,
}) => {
  const { t, formatNum, getDistrictName } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Search through stations and PIN codes
  const matchedStations = cleanQuery.length > 0
    ? stations.filter((st) => (
        st.location.toLowerCase().includes(cleanQuery) ||
        st.village.toLowerCase().includes(cleanQuery) ||
        st.pincode.includes(cleanQuery) ||
        st.block.toLowerCase().includes(cleanQuery) ||
        st.district.toLowerCase().includes(cleanQuery) ||
        st.post_office.toLowerCase().includes(cleanQuery) ||
        `#${st.id}`.includes(cleanQuery)
      )).slice(0, 8)
    : [];

  const matchedPincodes = cleanQuery.length > 0
    ? TRIPURA_PINCODES.filter((p) => (
        p.pincode.includes(cleanQuery) ||
        p.post_office.toLowerCase().includes(cleanQuery) ||
        p.district.toLowerCase().includes(cleanQuery) ||
        p.block.toLowerCase().includes(cleanQuery) ||
        p.villages.some(v => v.toLowerCase().includes(cleanQuery))
      )).slice(0, 4)
    : [];

  const handleSelectStation = (st: HydroStation) => {
    onSelectStation(st);
    setSearchQuery(`${st.location} (${st.pincode})`);
    setIsSearchOpen(false);
  };

  const handleSelectPincode = (p: PincodeEntry) => {
    let nearest: HydroStation = stations[0] || TRIPURA_STATIONS[0];
    let minDistance = Infinity;
    const candidates = stations.length > 0 ? stations : TRIPURA_STATIONS;
    for (const st of candidates) {
      const dist = calculateDistanceKm(p.lat, p.lng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = st;
      }
    }
    onSelectStation(nearest);
    onDropPin({ lat: p.lat, lng: p.lng });
    setSearchQuery(`${p.post_office} - ${p.pincode}`);
    setIsSearchOpen(false);
  };

  // Keyboard shortcut: Press Enter to select the top match or 6-digit PIN code
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedPincodes.length > 0) {
        handleSelectPincode(matchedPincodes[0]);
        return;
      }
      if (matchedStations.length > 0) {
        handleSelectStation(matchedStations[0]);
        return;
      }
      const digits = cleanQuery.replace(/\D/g, '');
      if (digits.length === 6) {
        const pinMatch = TRIPURA_PINCODES.find((p) => p.pincode === digits);
        if (pinMatch) {
          handleSelectPincode(pinMatch);
          return;
        }
        const stMatch = stations.find((s) => s.pincode === digits) || TRIPURA_STATIONS.find((s) => s.pincode === digits);
        if (stMatch) {
          handleSelectStation(stMatch);
          return;
        }
      }
    }
  };

  // Station calculated metrics - null-safe when no station selected yet
  const riskInfo = selectedStation ? getStationRiskCategory(selectedStation.risk) : null;
  const wellDepth = selectedStation ? calculateWellDepth(selectedStation.pre_depth) : null;

  const distanceFromPin = droppedPin && selectedStation
    ? calculateDistanceKm(droppedPin.lat, droppedPin.lng, selectedStation.lat, selectedStation.lng)
    : null;

  return (
    <section id="section-map" className="relative py-14 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* 1. Subtle Environmental Soil-to-Water Continuation Background */}
      <div className="absolute inset-0 -top-10 pointer-events-none overflow-hidden rounded-3xl opacity-25 dark:opacity-15">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-stone-900/40 via-sky-950/20 to-transparent" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.2),transparent_70%)] blur-2xl" />
      </div>

      {/* 2. Headline & Subtext */}
      <div className="mb-8 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 backdrop-blur-md">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Real-Time Subsurface Telemetry</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Know What Lies Beneath.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Search a location, village, or PIN code to understand groundwater conditions before drilling.
        </p>
      </div>

      {/* 3. Floating Glass / Water Panel for Search & Districts */}
      <div className="mb-8 max-w-4xl mx-auto relative z-30">
        <div className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-sky-200/70 dark:border-sky-500/30 shadow-[0_10px_35px_rgba(2,132,199,0.12)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div ref={searchContainerRef} className={`relative flex-1 ${isSearchOpen ? 'z-50' : 'z-20'}`}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-sky-600 dark:text-sky-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="station-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search Station / PIN (e.g. 799001, Agartala, Bishalgarh, Teliamura)..."
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500 transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      if (onClearStation) onClearStation();
                    }}
                    className="absolute right-3.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (matchedStations.length > 0 || matchedPincodes.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[1500] max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {matchedStations.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Observation Wells ({matchedStations.length})
                      </div>
                      {matchedStations.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleSelectStation(st)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition group cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                              {st.location}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {st.district} • {st.block} • PIN {st.pincode}
                            </div>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                            {st.pre_depth.toFixed(2)} m
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {matchedPincodes.length > 0 && (
                    <div className="p-2">
                      <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Postal PIN Directory
                      </div>
                      {matchedPincodes.map((p) => (
                        <button
                          key={p.pincode}
                          type="button"
                          onClick={() => handleSelectPincode(p)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition group cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                              PIN {p.pincode} — {p.post_office}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {p.district} • {p.block}
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                            Nearest Well →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Locate Me Button */}
            <button
              type="button"
              onClick={onLocateGps}
              disabled={isLocating}
              className="px-5 py-3 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 flex items-center justify-center gap-2 transition shrink-0 cursor-pointer shadow-xs"
            >
              <Crosshair className={`w-4 h-4 text-sky-600 dark:text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
            </button>
          </div>

          {/* Minimal District Selectors */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold shrink-0 mr-1">
              District:
            </span>
            {DISTRICTS.map((d) => {
              const isSelected = selectedDistrict === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onSelectDistrict(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs font-semibold'
                      : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  {d === 'ALL' ? 'All Districts' : getDistrictName(d)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Embedded Map Hero (68% width) & Telemetry Panel (32% width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-0">
        {/* Left/Center: Large Map (68% on Desktop) */}
        <div className="lg:col-span-8 bg-white/90 dark:bg-slate-900/90 border border-sky-400/20 dark:border-sky-500/20 rounded-3xl overflow-hidden shadow-xl relative z-0 flex flex-col">
          {/* Map Top Bar */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {stations.length} Telemetry Stations
              </span>
              <span>•</span>
              <span className="text-slate-500">Water-drop markers indicate live well locations</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Safe (&gt;70)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Moderate (40-70)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Stressed (&lt;40)
              </span>
            </div>
          </div>

          {/* Map Canvas (Embedded Hero) */}
          <div className="h-[480px] sm:h-[520px] w-full relative flex-1">
            <HydroMap
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={onSelectStation}
              droppedPin={droppedPin}
              onDropPin={onDropPin}
              selectedDistrict={selectedDistrict}
            />
          </div>

          {/* Map Bottom Bar */}
          <div className="px-5 py-2.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-sky-600 dark:text-sky-400 font-bold">●</span> Dug Well (D)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-sky-600 dark:text-sky-400 font-bold">◆</span> Piezometer (P)
              </span>
            </div>
            {droppedPin && (
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>Custom Target {distanceFromPin !== null ? `(${distanceFromPin} km away)` : ''}</span>
                <button
                  type="button"
                  onClick={onClearPin}
                  className="underline hover:text-sky-900 dark:hover:text-sky-100 font-semibold cursor-pointer ml-1"
                >
                  Clear Pin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Groundwater Telemetry Panel (32% on Desktop) */}
        {!selectedStation ? (
          <div className="lg:col-span-4 bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-300/30 dark:border-sky-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  <WaterDropIcon className="w-4 h-4" />
                  <span>Groundwater Telemetry</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Awaiting Selection
                </span>
              </div>

              {/* Water-drop Center Illustration */}
              <div className="mt-8 text-center px-2">
                <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  {/* Subtle water ripple rings */}
                  <div className="absolute inset-0 rounded-full bg-sky-400/15 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute -inset-2 rounded-full bg-sky-400/10" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 dark:from-sky-950 dark:to-cyan-950 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-md">
                    <WaterDropIcon className="w-8 h-8" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Select a Monitoring Station
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
                  Click any water-drop marker on the map or select a quick PIN code to unlock real-time subsurface water level data.
                </p>
              </div>

              {/* Quick Select Chips */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>Common PIN Codes</span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400">Click to explore</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { pin: '799001', name: 'Agartala', district: 'West' },
                    { pin: '799120', name: 'Udaipur', district: 'Gomati' },
                    { pin: '799250', name: 'Dharmanagar', district: 'North' },
                    { pin: '799114', name: 'Bishalgarh', district: 'Sepahijala' },
                    { pin: '799205', name: 'Teliamura', district: 'Khowai' },
                    { pin: '799277', name: 'Ambassa', district: 'Dhalai' },
                  ].map((item) => (
                    <button
                      key={item.pin}
                      type="button"
                      onClick={() => {
                        const p = TRIPURA_PINCODES.find((x) => x.pincode === item.pin);
                        if (p) {
                          handleSelectPincode(p);
                        } else {
                          const st = stations.find((s) => s.pincode === item.pin) || TRIPURA_STATIONS.find((s) => s.pincode === item.pin);
                          if (st) handleSelectStation(st);
                        }
                      }}
                      className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800/60 dark:hover:bg-sky-950/60 border border-slate-200 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-700 transition group cursor-pointer"
                    >
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        PIN {item.pin}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.name} • {item.district}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                118 verified CGWB observation stations
              </span>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-4 bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border border-sky-400/30 dark:border-sky-500/25 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            {/* Header & Station Name */}
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  <WaterDropIcon className="w-4 h-4" />
                  <span>Groundwater Telemetry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    #{selectedStation.id} • {selectedStation.type === 'DUG' ? 'Dug Well' : 'Piezometer'}
                  </span>
                  {onClearStation && (
                    <button
                      type="button"
                      onClick={onClearStation}
                      className="text-xs text-slate-400 hover:text-rose-500 underline cursor-pointer ml-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 leading-tight">
                {selectedStation.location}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedStation.district} District • {selectedStation.block} Block • PIN {selectedStation.pincode}
              </p>

              {/* Water Level & Well Depth Floating Numbers */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-2xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-300">
                    <WaterDropIcon className="w-3.5 h-3.5" />
                    <span>Water Level</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {selectedStation.pre_depth.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">mbgl</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Pre-monsoon static level
                  </p>
                </div>

                <div className="bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3.5">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Well Depth
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {wellDepth ? wellDepth.toFixed(2) : '--'}{' '}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">m</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Water + 3.5m screen + sump
                  </p>
                </div>
              </div>

              {/* Vulnerability & Trend */}
              <div className="space-y-2.5 mt-3">
                {riskInfo && (
                  <div className={`p-3.5 rounded-2xl border ${riskInfo.bg} ${riskInfo.border}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Vulnerability Score
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${riskInfo.text} bg-white/80 dark:bg-slate-900/80 border border-current`}>
                        {riskInfo.score}/100 • {riskInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {riskInfo.desc}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Decadal Trend:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedStation.trend_fall > 0
                      ? `-${selectedStation.trend_fall.toFixed(2)} m/yr (Decline)`
                      : selectedStation.trend_rise > 0
                      ? `+${selectedStation.trend_rise.toFixed(2)} m/yr (Recharge)`
                      : 'Stable Equilibrium'}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onViewHydroData}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <WaterDropIcon className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                <span>View Detailed Hydrogeology</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
