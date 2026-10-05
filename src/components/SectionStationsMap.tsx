import React from 'react';
import { MapPin, Search, Filter, Radio, ChevronRight, Layers, Crosshair } from 'lucide-react';
import { HydroStation } from '../types';
import { DISTRICTS, calculateDistanceKm } from '../data/tripuraData';
import { HydroMap } from './HydroMap';
import { SearchFilter } from './SearchFilter';
import { useLanguage } from '../context/LanguageContext';

interface SectionStationsMapProps {
  stations: HydroStation[];
  selectedStation: HydroStation;
  onSelectStation: (station: HydroStation) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  droppedPin: { lat: number; lng: number } | null;
  onDropPin: (coords: { lat: number; lng: number }) => void;
  onClearPin: () => void;
  onLocateGps: () => void;
  isLocating: boolean;
}

export const SectionStationsMap: React.FC<SectionStationsMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  selectedDistrict,
  onSelectDistrict,
  droppedPin,
  onDropPin,
  onClearPin,
  onLocateGps,
  isLocating,
}) => {
  const { t, getDistrictName } = useLanguage();

  const filteredStations = stations.filter(
    (st) => selectedDistrict === 'ALL' || st.district === selectedDistrict
  );

  const dugCount = filteredStations.filter((s) => s.type === 'DUG').length;
  const pzCount = filteredStations.filter((s) => s.type === 'PZ').length;

  return (
    <section
      id="section-stations"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>PHASE IV • SPATIAL TELEMETRY NETWORK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tripura Monitoring Network
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Live telemetry from 118 CGWB observation wells spanning all 8 administrative districts. Drop pins or click markers to inspect hydraulic heads.
          </p>
        </div>

        {/* Station Type Symbology Counters */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>DUG WELLS ({dugCount})</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span>PIEZOMETERS ({pzCount})</span>
          </div>
        </div>
      </div>

      {/* Integrated Search & Filter Row */}
      <div className="mb-6">
        <SearchFilter
          stations={stations}
          selectedStation={selectedStation}
          onSelectStation={onSelectStation}
          droppedPin={droppedPin}
          onClearPin={onClearPin}
        />
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] bg-slate-950">
        <div className="h-[520px] sm:h-[620px] w-full relative">
          <HydroMap
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={onSelectStation}
            droppedPin={droppedPin}
            onDropPin={onDropPin}
            selectedDistrict={selectedDistrict}
          />
        </div>

        {/* Map Bottom Status Bar */}
        <div className="px-4 py-3 bg-slate-950/90 border-t border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Selected Station:</span>
            <span className="text-white font-bold">{selectedStation.location}</span>
            <span className="text-cyan-400">({selectedStation.district})</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Lat: {selectedStation.lat.toFixed(4)}°N</span>
            <span>Lng: {selectedStation.lng.toFixed(4)}°E</span>
            <span>Type: {selectedStation.type === 'DUG' ? 'Dug Well (Shallow)' : 'Piezometer (Deep)'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
