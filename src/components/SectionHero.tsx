import React from 'react';
import { ArrowDown, Search, Radio, Compass, ShieldCheck, Activity } from 'lucide-react';
import { HydroStation } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SectionHeroProps {
  totalStations: number;
  selectedStation: HydroStation | null;
  onExploreAquifer: () => void;
  onSearchStation: () => void;
}

export const SectionHero: React.FC<SectionHeroProps> = ({
  totalStations,
  selectedStation,
  onExploreAquifer,
  onSearchStation,
}) => {
  const { formatNum } = useLanguage();

  return (
    <section
      id="hero-surface"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Top Scientific Metadata Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>WGS-84 SYNCLINAL FOLD BELT OBSERVATORY</span>
        </div>

        <div className="flex items-center gap-3 text-cyan-200/70">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            118 TELEMETRIC STATIONS
          </span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline">CGWB NORTH EASTERN REGION</span>
        </div>
      </div>

      {/* Center Cinematic Typography & Action Block */}
      <div className="my-auto max-w-4xl space-y-6 pt-6 sm:pt-12">
        <div className="space-y-3">
          <div className="inline-block text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-md">
            Earth's Surface Horizon • 0.0 Meters
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            Tripura <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Groundwater Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-cyan-100/90 font-light tracking-wide max-w-2xl">
            Pre-Drilling Hydrogeological Intelligence Platform
          </p>

          <p className="text-sm sm:text-base text-slate-300/80 max-w-xl font-normal leading-relaxed">
            Understand groundwater conditions before you drill. Real-time static water heads, lithological horizons, and precision engineering directives across Tripura's 8 districts.
          </p>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            type="button"
            onClick={onExploreAquifer}
            className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] cursor-pointer"
          >
            <span>EXPLORE THE AQUIFER</span>
            <ArrowDown className="w-4 h-4 text-slate-950 group-hover:translate-y-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onSearchStation}
            className="group flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-sm tracking-wide font-mono transition-all cursor-pointer backdrop-blur-md"
          >
            <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>SEARCH STATION / PIN</span>
          </button>
        </div>
      </div>

      {/* Bottom Scientific HUD Display */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-cyan-500/20">
        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            TELEMETRY NETWORK
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            118 STATIONS
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            CGWB & State Authority
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-cyan-400" />
            GEOGRAPHIC EXTENT
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            8 DISTRICTS
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Tripura Synclinal Basins
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            WATER TABLE SPAN
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
            0.35m – 27.9m
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Static Pre-Monsoon Head
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/5 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            CURRENT FOCUS
          </div>
          <div className="text-base sm:text-lg font-mono font-bold text-emerald-300 truncate">
            {selectedStation ? selectedStation.location : 'Tripura State'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            {selectedStation ? `#${selectedStation.id} • ${selectedStation.pincode}` : 'Select a station below'}
          </div>
        </div>
      </div>
    </section>
  );
};
