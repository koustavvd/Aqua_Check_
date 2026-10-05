import React from 'react';
import { MapPin, Crosshair, Printer, Droplets, Languages, Sun, Moon, Waves } from 'lucide-react';
import { DISTRICTS } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { WaterTextBg } from './WaterTextBg';

interface NavbarProps {
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onLocateGps: () => void;
  isLocating: boolean;
  onPrintReport: () => void;
  stationCount: number;
  water3dActive?: boolean;
  onToggleWater3d?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onLocateGps,
  isLocating,
  onPrintReport,
  stationCount,
  water3dActive = true,
  onToggleWater3d,
}) => {
  const { language, setLanguage, openLanguageModal, t, getDistrictName } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/55 dark:bg-slate-950/45 border-b border-white/60 dark:border-sky-500/20 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Branding & Attribution */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-sky-950/60 border border-sky-300/60 dark:border-sky-700/80 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0 shadow-sm relative overflow-hidden group backdrop-blur-xs">
            <Droplets className="w-5 h-5 stroke-[2.2] relative z-10 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-radial from-sky-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-mono">
                {t.govTripura}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-100/70 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                {t.stationsCount(stationCount)}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
              <WaterTextBg variant="title">
                {t.appTitle}
              </WaterTextBg>
            </h1>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 3D Water Surface Mode Toggle */}
          {onToggleWater3d && (
            <button
              type="button"
              onClick={onToggleWater3d}
              title={water3dActive ? t.water3dOn : t.water3dOff}
              aria-label={t.water3dMode}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border backdrop-blur-xs ${
                water3dActive
                  ? 'bg-sky-500/20 dark:bg-sky-950/70 border-sky-400 dark:border-sky-600 text-sky-800 dark:text-sky-300 shadow-2xs font-semibold'
                  : 'bg-white/40 dark:bg-slate-900/40 border-white/60 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Waves className={`w-3.5 h-3.5 ${water3dActive ? 'animate-pulse text-sky-600 dark:text-sky-400' : ''}`} />
              <span className="hidden md:inline">{t.water3dMode}</span>
            </button>
          )}

          {/* Theme Mode Toggle (Light / Dark) */}
          <div className="flex items-center bg-white/45 dark:bg-slate-900/45 p-0.5 rounded-lg border border-white/60 dark:border-sky-500/20 backdrop-blur-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setTheme('light')}
              title={t.lightMode}
              aria-label={t.lightMode}
              className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                theme === 'light'
                  ? 'bg-white/95 text-amber-600 shadow-xs ring-1 ring-slate-200/80 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.light}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              title={t.darkMode}
              aria-label={t.darkMode}
              className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                theme === 'dark'
                  ? 'bg-sky-950/90 text-sky-300 shadow-xs border border-sky-700/60 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.dark}</span>
            </button>
          </div>

          {/* Language Switcher (English / বাংলা / हिन्दी) */}
          <div className="flex items-center bg-white/45 dark:bg-slate-900/45 p-0.5 rounded-lg border border-white/60 dark:border-sky-500/20 backdrop-blur-xs shadow-2xs">
            <button
              type="button"
              onClick={openLanguageModal}
              title={t.chooseLanguage}
              className="p-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 transition"
              aria-label={t.chooseLanguage}
            >
              <Languages className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                language === 'en'
                  ? 'bg-sky-500/20 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-400/50 dark:border-sky-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                language === 'bn'
                  ? 'bg-sky-500/20 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-400/50 dark:border-sky-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="বাংলায় দেখুন"
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                language === 'hi'
                  ? 'bg-sky-500/20 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-400/50 dark:border-sky-600 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="हिन्दी में देखें"
            >
              हिन्दी
            </button>
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <label htmlFor="district-select" className="sr-only">{t.selectDistrict}</label>
            <div className="flex items-center bg-white/45 dark:bg-slate-900/45 border border-white/60 dark:border-sky-500/20 backdrop-blur-xs rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-sky-500/30 focus-within:border-sky-600 transition">
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mr-1.5 shrink-0" />
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none cursor-pointer pr-1"
              >
                {DISTRICTS.map((district) => (
                  <option key={district} value={district} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {getDistrictName(district)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Locate Button */}
          <button
            type="button"
            onClick={onLocateGps}
            disabled={isLocating}
            title={t.gpsLocate}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/45 dark:bg-slate-900/45 hover:bg-white/70 dark:hover:bg-slate-900/70 text-slate-800 dark:text-slate-100 border border-white/60 dark:border-sky-500/20 backdrop-blur-xs transition"
          >
            <Crosshair className={`w-3.5 h-3.5 text-sky-600 dark:text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t.acquiringGps : t.gpsLocate}</span>
          </button>

          {/* Print/Export */}
          <button
            type="button"
            onClick={onPrintReport}
            title={t.printReport}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/45 dark:bg-slate-900/45 hover:bg-white/70 dark:hover:bg-slate-900/70 text-slate-800 dark:text-slate-100 border border-white/60 dark:border-sky-500/20 backdrop-blur-xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>{t.printReport}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
