import React, { useState, useEffect } from 'react';
import { MapPin, Crosshair, Printer, Search, Sun, Moon, Languages } from 'lucide-react';
import { DISTRICTS } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { WaterDropIcon } from './WaterDropIcon';

interface CleanNavbarProps {
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onLocateGps: () => void;
  isLocating: boolean;
  onPrintReport: () => void;
  onTriggerSearch: () => void;
  stationCount: number;
}

export const CleanNavbar: React.FC<CleanNavbarProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onLocateGps,
  isLocating,
  onPrintReport,
  onTriggerSearch,
  stationCount,
}) => {
  const { language, setLanguage, openLanguageModal, t, getDistrictName } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs py-2.5'
          : 'bg-white/40 dark:bg-slate-950/40 border-b border-white/20 dark:border-slate-800/30 backdrop-blur-xs py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <WaterDropIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                AQUA CHECK
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {stationCount} Stations
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden xs:block">
              Tripura Groundwater Intelligence
            </p>
          </div>
        </a>

        {/* Center / Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onTriggerSearch}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition shadow-2xs"
            title="Search stations or PIN"
          >
            <Search className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden md:inline">Search Station</span>
          </button>

          {/* District Selector */}
          <div className="relative">
            <label htmlFor="navbar-district" className="sr-only">District</label>
            <div className="flex items-center bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2 sm:px-2.5 py-1.5 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mr-1 shrink-0" />
              <select
                id="navbar-district"
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer max-w-[90px] sm:max-w-[130px] truncate"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {d === 'ALL' ? 'All Districts' : getDistrictName(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Locate */}
          <button
            type="button"
            onClick={onLocateGps}
            disabled={isLocating}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition shadow-2xs"
            title="Locate via GPS"
          >
            <Crosshair className={`w-3.5 h-3.5 text-sky-600 dark:text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{isLocating ? 'Locating...' : 'GPS'}</span>
          </button>

          {/* Language Switch */}
          <div className="flex items-center bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={openLanguageModal}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                language === 'en'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                language === 'bn'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                language === 'hi'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              हि
            </button>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition shadow-2xs"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Print Report Button */}
          <button
            type="button"
            onClick={onPrintReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm"
            title="Print Hydrogeological Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
