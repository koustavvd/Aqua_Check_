import React from 'react';
import { useTheme } from '../context/ThemeContext';
import neermahalImg from '../assets/images/neermahal_tripura_water_1789483594134.jpg';
import { Waves, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TripuraHeritageBackdrop: React.FC = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const culturalSubtitle =
    language === 'bn'
      ? 'ত্রিপুরার জল ঐতিহ্য: রুদ্রসাগর হ্রদের নীরমহল ও গোমতী নদী অববাহিকা'
      : language === 'hi'
      ? 'त्रिपुरा की जल धरोहर: रुद्रसागर झील का नीरमहल एवं गोमती नदी बेसिन'
      : "Tripura's Living Water Heritage: Neermahal on Rudrasagar Lake & Gomati River Basin";

  return (
    <div className="relative w-full overflow-hidden pointer-events-none select-none z-0">
      {/* 3D Atmospheric Vista: Neermahal Water Palace on Rudrasagar Lake */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden">
        {/* Scenic photographic vista with 3D depth and subtle parallax */}
        <div className="absolute inset-0 transform scale-105 transition-transform duration-1000 ease-out">
          <img
            src={neermahalImg}
            alt="Neermahal Water Palace Tripura"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center filter transition-all duration-700 ${
              isDark
                ? 'brightness-[0.45] contrast-[1.15] saturate-[0.85]'
                : 'brightness-[0.92] contrast-[1.05] saturate-[1.1]'
            }`}
          />
        </div>

        {/* Multi-layered natural water gradients to seamlessly blend into page body */}
        <div
          className={`absolute inset-0 transition-colors duration-700 ${
            isDark
              ? 'bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950'
              : 'bg-gradient-to-b from-sky-900/25 via-sky-50/75 to-slate-50'
          }`}
        />

        {/* Traditional Tripura Indigenous Textile Motif (Rignai 'Mosoroi' Geometric Water-Wave Lattice) */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tripura-water-weave" width="48" height="48" patternUnits="userSpaceOnUse">
                {/* Traditional geometric diamond water-wave repeat */}
                <path
                  d="M24 0 L48 24 L24 48 L0 24 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-sky-950 dark:text-sky-200"
                />
                <path
                  d="M24 8 L40 24 L24 40 L8 24 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-teal-700 dark:text-cyan-300"
                />
                <circle cx="24" cy="24" r="2.5" fill="currentColor" className="text-amber-500/60 dark:text-amber-400/60" />
                <path
                  d="M0 0 L48 48 M48 0 L0 48"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  className="text-sky-900 dark:text-sky-300"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tripura-water-weave)" />
          </svg>
        </div>

        {/* Ambient Hydro Light Caustics / Sun Glint */}
        <div className="absolute inset-0 bg-radial from-sky-400/20 via-transparent to-transparent opacity-60 animate-pulse pointer-events-none" />

        {/* Cultural Water Heritage Pill & Ambient Title Accent */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-4 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium backdrop-blur-md border shadow-lg transition-all duration-300 w-fit bg-white/80 dark:bg-slate-900/80 border-sky-300/60 dark:border-sky-700/60 text-sky-900 dark:text-sky-200">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <Waves className="w-3 h-3 animate-pulse" />
            </span>
            <span className="font-semibold tracking-wide">
              {culturalSubtitle}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Rudrasagar Ramsar Wetland
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
