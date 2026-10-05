import React from 'react';
import {
  Compass,
  MapPin,
  Crosshair,
  Printer,
  Moon,
  Sun,
  Search,
  Languages,
  Layers,
  ChevronDown
} from 'lucide-react';
import { DISTRICTS } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface FloatingNavHUDProps {
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onLocateGps: () => void;
  isLocating: boolean;
  onPrintReport: () => void;
  onTriggerSearch: () => void;
  activeSection: string;
  currentDepthMeters: number;
}

const STORY_SECTIONS = [
  { id: 'hero-surface', label: 'SURFACE', depth: '0 m' },
  { id: 'section-descent', label: 'DESCENT', depth: '6.5 m' },
  { id: 'section-aquifer', label: 'AQUIFER', depth: '14.0 m' },
  { id: 'section-stations', label: 'STATIONS', depth: '35 m' },
  { id: 'section-analysis', label: 'ANALYSIS', depth: '60 m' },
  { id: 'section-drilling', label: 'DRILLING', depth: '85 m' },
  { id: 'section-decision', label: 'DECISION', depth: '120 m' },
];

export const FloatingNavHUD: React.FC<FloatingNavHUDProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onLocateGps,
  isLocating,
  onPrintReport,
  onTriggerSearch,
  activeSection,
  currentDepthMeters,
}) => {
  const { language, setLanguage, t, openLanguageModal, getDistrictName } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Floating Glass HUD Bar */}
      <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 max-w-7xl mx-auto z-50 pointer-events-none transition-all duration-300">
        <div className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white">
          {/* Top-Left: Scientific Identity / Logo */}
          <button
            type="button"
            onClick={() => scrollTo('hero-surface')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-inner group-hover:border-cyan-300 transition-colors">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors">
                <span>AQUA CHECK</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                  TRIPURA
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-cyan-200/60 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                CGWB Telemetry • WGS 84
              </div>
            </div>
          </button>

          {/* Top-Right: Scientific Command Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search Trigger */}
            <button
              type="button"
              onClick={onTriggerSearch}
              title="Search Stations / PIN code"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-200 border border-white/10 hover:border-cyan-400/40 text-xs font-mono transition"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Search Station / PIN</span>
            </button>

            {/* District Selector */}
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-cyan-400/40 rounded-xl px-2 py-1 transition">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
              <select
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="bg-transparent text-xs font-mono text-cyan-100 outline-none cursor-pointer pr-1 appearance-none max-w-[100px] sm:max-w-[130px] truncate"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {getDistrictName(d)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-300 pointer-events-none shrink-0" />
            </div>

            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={onLocateGps}
              disabled={isLocating}
              title={t.gpsLocate}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-200 border border-white/10 hover:border-cyan-400/40 text-xs font-mono transition"
            >
              <Crosshair className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">{isLocating ? t.acquiringGps : t.gpsLocate}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-1 rounded-lg text-xs font-mono transition ${
                  language === 'en'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-1.5 py-1 rounded-lg text-xs font-mono transition ${
                  language === 'bn'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
                title="বাংলা"
              >
                বাং
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-1 rounded-lg text-xs font-mono transition ${
                  language === 'hi'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
                title="हिन्दी"
              >
                हि
              </button>
            </div>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? t.lightMode : t.darkMode}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Print Hydrogeological Report */}
            <button
              type="button"
              onClick={onPrintReport}
              title={t.printReport}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-200 border border-cyan-400/40 text-xs font-mono transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.printReport}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Right-Side Vertical Depth & Narrative Journey HUD Meter */}
      <aside className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 pointer-events-none select-none">
        {/* Live Depth Readout Pill */}
        <div className="pointer-events-auto px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 shadow-lg text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>DEPTH: {currentDepthMeters.toFixed(1)} m</span>
        </div>

        {/* Narrative Section Track */}
        <div className="pointer-events-auto flex flex-col items-end gap-2.5 p-2 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-xl">
          {STORY_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className="group flex items-center gap-2 text-right focus:outline-none cursor-pointer"
              >
                <span
                  className={`text-[10px] font-mono transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 font-bold opacity-100 scale-105'
                      : 'text-white/40 group-hover:text-white/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {sec.label} ({sec.depth})
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-400 ring-4 ring-cyan-400/30 scale-125'
                      : 'bg-white/20 group-hover:bg-cyan-400/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
