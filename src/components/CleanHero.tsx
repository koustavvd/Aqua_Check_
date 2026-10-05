import React from 'react';
import { ArrowDown, Search, MapPin, ShieldCheck, Waves, Droplet } from 'lucide-react';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface CleanHeroProps {
  totalStations: number;
  onExplore: () => void;
  onSearch: () => void;
}

export const CleanHero: React.FC<CleanHeroProps> = ({
  totalStations,
  onExplore,
  onSearch,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-20 pb-12 select-none"
    >
      {/* 1. Realistic Photographic Earth-to-Water Subsurface Cross-Section Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Upper Surface: Real Earth & Soil Cross-Section */}
        <div className="absolute top-0 left-0 right-0 h-[52%] overflow-hidden">
          <img
            src={IMAGES.realEarthSoil}
            alt="Natural fertile soil and earth geological cross section"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          />
          {/* Subtle Organic Warm Light Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-transparent" />
        </div>

        {/* Lower Subsurface: Pure Clear Groundwater filtering through porous sandstone */}
        <div className="absolute top-[48%] left-0 right-0 bottom-0 overflow-hidden">
          <img
            src={IMAGES.cleanAquiferWater}
            alt="Pristine clear underground water filtering through natural sandstone"
            className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.08]"
          />
          {/* Deep clean blue gradient blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-950/40 to-slate-950/80" />
        </div>

        {/* The Transition Zone: Soil gradually becomes moist earth, then clear groundwater */}
        <div className="absolute top-[42%] left-0 right-0 h-28 bg-gradient-to-b from-stone-900/80 via-cyan-950/60 to-transparent backdrop-blur-[1px]" />

        {/* Subtle Water Caustic / Depth Highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(56,189,248,0.15),transparent_70%)]" />
      </div>

      {/* 2. Hero Content Frame */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 my-auto text-center flex flex-col items-center">
        {/* Water-Drop Identity Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-800 shadow-sm backdrop-blur-md mb-6">
          <WaterDropIcon className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
            Tripura Water Resources &amp; CGWB Telemetry
          </span>
        </div>

        {/* Main Heading - Clean, readable, non-sci-fi typography */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md max-w-4xl leading-[1.15]">
          Groundwater Intelligence for Smarter Drilling
        </h1>

        {/* Small Supporting Text */}
        <p className="mt-4 text-base sm:text-xl text-slate-100/90 dark:text-slate-200 max-w-2xl font-normal drop-shadow-sm">
          Understand groundwater conditions before you drill.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            type="button"
            onClick={onExplore}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explore Your Location</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onSearch}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 border border-white/40 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
          >
            <Search className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Search Station / PIN</span>
          </button>
        </div>

        {/* Trust & Scientific Indicators */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-slate-800/80 rounded-xl p-3 shadow-xs backdrop-blur-md text-left">
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 mb-1">
              <Droplet className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Monitoring Wells</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {totalStations} Stations
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-slate-800/80 rounded-xl p-3 shadow-xs backdrop-blur-md text-left">
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Districts</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              8 Districts
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-slate-800/80 rounded-xl p-3 shadow-xs backdrop-blur-md text-left">
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 mb-1">
              <Waves className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Trend History</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              10-Yr Decadal
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-slate-800/80 rounded-xl p-3 shadow-xs backdrop-blur-md text-left">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Advisory</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              Pre-Drilling
            </div>
          </div>
        </div>
      </div>

      {/* 3. Subtle Natural Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-4">
        <button
          type="button"
          onClick={onExplore}
          className="text-xs font-medium text-slate-200/90 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Scroll into the Ground</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
