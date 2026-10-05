import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import aquiferCrossSectionImg from '../assets/images/aquifer_cross_section_1789485756952.jpg';
import { ChevronDown, Droplets, ArrowDown, Compass, Layers, Sparkles } from 'lucide-react';

interface HeroAquiferCrossSectionProps {
  onDiveToWorkspace: () => void;
}

export const HeroAquiferCrossSection: React.FC<HeroAquiferCrossSectionProps> = ({ onDiveToWorkspace }) => {
  const { t, formatNum } = useLanguage();
  const { isDark } = useTheme();

  return (
    <section 
      aria-label="Tripura Subterranean Aquifer Cross-Section" 
      className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center select-none"
    >
      {/* Whole Cross-Section Background Picture (Fades smoothly into subterranean water cavern) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)',
        }}
      >
        <img
          src={aquiferCrossSectionImg}
          alt="Geological cross-section of Tripura ground surface and subterranean aquifer cavern"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transform scale-100 transition-transform duration-700 ease-out hover:scale-[1.01] ${
            isDark ? 'brightness-[0.92] contrast-[1.08]' : 'brightness-[1.0] contrast-[1.04]'
          }`}
        />

        {/* Ambient Depth Gradients & Crystal Light Refractions */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Seamless Aquatic Caustic Transition Layer into Submerged Workspace */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-sky-950/20 to-transparent pointer-events-none z-[1]" />

      {/* Geological Depth Stratum Gauge Overlay (Left Side) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 flex justify-between items-start pointer-events-none">
        <div className="backdrop-blur-md bg-white/70 dark:bg-slate-950/65 border border-white/60 dark:border-sky-500/30 rounded-xl px-3 py-2 text-[11px] font-mono shadow-lg flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-sky-900 dark:text-sky-300 font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Hydro-Stratum</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{formatNum(0.0)} m: Ground Topsoil</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{formatNum(3.2)} m: Vadose Clay Layer</span>
          </div>
          <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>{formatNum(6.5)}–{formatNum(14.0)} m: Aquifer Pool</span>
          </div>
        </div>

        {/* Central CGWB Network Pill */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-slate-950/65 border border-white/60 dark:border-sky-500/30 rounded-xl px-3.5 py-1.5 text-[11px] font-mono shadow-lg text-slate-800 dark:text-slate-200 flex items-center gap-2 pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">{t.govTripura}</span>
        </div>
      </div>

      {/* Centerpiece Hero Title & Call To Action (Crystal Glass Floating Over Aquifer) */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center my-auto py-8">
        <div className="backdrop-blur-md bg-white/75 dark:bg-slate-950/70 border border-white/80 dark:border-sky-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-sky-950/20 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 dark:bg-sky-500/25 border border-sky-400/50 text-sky-900 dark:text-sky-200 text-xs font-mono font-semibold mb-3">
            <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight mb-2.5">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed mb-6 font-medium">
            {t.heroSubtitle}
          </p>

          {/* Primary Action Button to Dive into the Water and Access PIN Code / Workspace */}
          <button
            type="button"
            onClick={onDiveToWorkspace}
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-sky-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-sky-600/30 hover:shadow-sky-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-sky-300/40"
          >
            <Droplets className="w-5 h-5 text-sky-200 group-hover:scale-110 transition-transform" />
            <span>{t.diveButton}</span>
            <ArrowDown className="w-4 h-4 text-sky-200 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Submerge / Scroll Guide (Directing user down into the water) */}
      <div className="relative z-10 pb-8 sm:pb-12 w-full flex flex-col items-center pointer-events-auto">
        <button
          type="button"
          onClick={onDiveToWorkspace}
          className="flex flex-col items-center gap-1.5 text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-300 transition-colors group cursor-pointer focus:outline-none"
        >
          <span className="backdrop-blur-md bg-white/70 dark:bg-slate-950/65 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border border-white/60 dark:border-sky-500/30 shadow-md">
            {t.scrollIndicator}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-sky-500/40 shadow-lg flex items-center justify-center group-hover:border-sky-400">
            <ChevronDown className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
