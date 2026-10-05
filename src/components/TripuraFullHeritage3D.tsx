import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import underwaterAquiferImg from '../assets/images/underwater_aquifer_deep_1789485783475.jpg';
import neermahalImg from '../assets/images/neermahal_tripura_water_1789483594134.jpg';
import ujjayantaImg from '../assets/images/ujjayanta_palace_water_1789484175498.jpg';
import chabimuraImg from '../assets/images/chabimura_gomati_water_1789484192880.jpg';
import { Waves, Sparkles, Compass, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface LandmarkData {
  id: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
  descEn: string;
  descBn: string;
  descHi: string;
  districtEn: string;
  districtBn: string;
  districtHi: string;
  targetScroll: number; // 0 to 1
}

const LANDMARKS: LandmarkData[] = [
  {
    id: 'neermahal',
    nameEn: 'Neermahal Water Palace',
    nameBn: 'নীরমহল জল প্রাসাদ',
    nameHi: 'नीरमहल जल महल',
    descEn: 'Rudrasagar Lake Ramsar Wetland & Shallow Aquifer Recharge Basin',
    descBn: 'রুদ্রসাগর হ্রদ রামসার জলাভূমি ও অগভীর অ্যাকুইফার রিচার্জ এলাকা',
    descHi: 'रुद्रसागर झील रामसर आर्द्रभूमि और उथला जलभृत पुनर्भरण बेसिन',
    districtEn: 'Sepahijala District',
    districtBn: 'সিপাহীজলা জেলা',
    districtHi: 'सिपाहीजाला जिला',
    targetScroll: 0.05,
  },
  {
    id: 'ujjayanta',
    nameEn: 'Ujjayanta Royal Water Reflections',
    nameBn: 'উজ্জয়ন্ত প্রাসাদ ও জল ফোয়ারা',
    nameHi: 'उज्जयंत पैलेस एवं फव्वारे',
    descEn: 'Howrah River Basin, Royal Reflection Pools & Semi-Confined Wells',
    descBn: 'হাওড়া নদী অববাহিকা, ঐতিহ্যবাহী রাজকীয় জলাশয় ও নলকূপ নেটওয়ার্ক',
    descHi: 'हावड़ा नदी बेसिन, ऐतिहासिक जलकुंड एवं अर्ध-सीमित जलभृत',
    districtEn: 'West Tripura (Agartala)',
    districtBn: 'পশ্চিম ত্রিপুরা (আগরতলা)',
    districtHi: 'पश्चिम त्रिपुरा (अगरतला)',
    targetScroll: 0.45,
  },
  {
    id: 'chabimura',
    nameEn: 'Chabimura & Gomati Gorge',
    nameBn: 'ছবিমুড়া ও গোমতী নদী উপত্যকা',
    nameHi: 'छबीमुरा एवं गोमती नदी घाटी',
    descEn: 'Debtamura Riverbed, Deep Sandstone Gorge & Groundwater Springs',
    descBn: 'দেবতামুড়া নদীগর্ভ, গভীর বেলেপাথর গিরিখাত ও প্রাকৃতিক প্রস্রবণ',
    descHi: 'देवतामुड़ा नदी तल, बलुआ पत्थर की घाटी एवं प्राकृतिक भूजल झरने',
    districtEn: 'Gomati District (Amarpur)',
    districtBn: 'গোমতী জেলা (অমরপুর)',
    districtHi: 'गोमती जिला (अमरपुर)',
    targetScroll: 0.85,
  },
];

export const TripuraFullHeritage3D: React.FC = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [scrollRatio, setScrollRatio] = useState<number>(0);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLandmarkIndex, setActiveLandmarkIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const ratio = docHeight > 0 ? Math.min(1, Math.max(0, currentScroll / docHeight)) : 0;
          setScrollRatio(ratio);

          // Update active landmark index based on scroll zones
          if (ratio < 0.32) {
            setActiveLandmarkIndex(0); // Neermahal
          } else if (ratio < 0.70) {
            setActiveLandmarkIndex(1); // Ujjayanta
          } else {
            setActiveLandmarkIndex(2); // Chabimura / Gomati Gorge
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle 3D mouse tilt tracking for perspective
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMouseTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth jump to section
  const scrollToLandmark = (targetRatio: number) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: docHeight * targetRatio,
      behavior: 'smooth',
    });
  };

  // Calculate precise crossfade opacities for the 3 heritage layers
  // Zone 0 (Aquifer Cavern Workspace): scrollRatio 0 to 0.40 -> 100% subterranean crystal water!
  // Zone 1: Neermahal [0.42 to 0.68]
  let neermahalOpacity = 0;
  if (scrollRatio >= 0.40 && scrollRatio <= 0.54) {
    neermahalOpacity = (scrollRatio - 0.40) / 0.14;
  } else if (scrollRatio > 0.54 && scrollRatio <= 0.68) {
    neermahalOpacity = 1 - (scrollRatio - 0.54) / 0.14;
  }
  neermahalOpacity = Math.max(0, Math.min(1, neermahalOpacity));

  // Zone 2: Ujjayanta [0.65 to 0.85]
  let ujjayantaOpacity = 0;
  if (scrollRatio >= 0.64 && scrollRatio <= 0.75) {
    ujjayantaOpacity = (scrollRatio - 0.64) / 0.11;
  } else if (scrollRatio > 0.75 && scrollRatio <= 0.86) {
    ujjayantaOpacity = 1 - (scrollRatio - 0.75) / 0.11;
  }
  ujjayantaOpacity = Math.max(0, Math.min(1, ujjayantaOpacity));

  // Zone 3: Chabimura [0.82 to 1.0]
  const chabimuraOpacity = Math.max(0, Math.min(1, (scrollRatio - 0.82) / 0.18));

  const currentLandmark = LANDMARKS[activeLandmarkIndex];
  const landmarkName =
    language === 'bn' ? currentLandmark.nameBn : language === 'hi' ? currentLandmark.nameHi : currentLandmark.nameEn;
  const landmarkDesc =
    language === 'bn' ? currentLandmark.descBn : language === 'hi' ? currentLandmark.descHi : currentLandmark.descEn;
  const landmarkDistrict =
    language === 'bn' ? currentLandmark.districtBn : language === 'hi' ? currentLandmark.districtHi : currentLandmark.districtEn;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Transform Container that tilts gently with cursor and shifts with scroll */}
      <div
        className="absolute inset-[-4%] w-[108%] h-[108%] transition-transform duration-300 ease-out"
        style={{
          transform: `rotateY(${mouseTilt.x * 2.5}deg) rotateX(${-mouseTilt.y * 2.5}deg) translateZ(0)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ================= FOUNDATIONAL LAYER: Subterranean Crystal Aquifer Water ================= */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: Math.max(0.75, 1 - neermahalOpacity * 0.4),
            transform: `translateY(${scrollRatio * -30}px) scale(${1.01 + scrollRatio * 0.05})`,
            transition: 'opacity 0.6s ease-out, transform 0.2s ease-out',
          }}
        >
          <img
            src={underwaterAquiferImg}
            alt="Submerged Subterranean Aquifer Cavern Water"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center ${
              isDark
                ? 'brightness-[0.88] contrast-[1.12] saturate-[1.25]'
                : 'brightness-[1.03] contrast-[1.05] saturate-[1.15]'
            }`}
          />
        </div>

        {/* ================= LAYER 1: Neermahal (Rudrasagar Lake Shallow Aquifer) ================= */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out mix-blend-soft-light"
          style={{
            opacity: neermahalOpacity * 0.7,
            transform: `translateY(${scrollRatio * -60}px) scale(${1.02 + scrollRatio * 0.08})`,
            transition: 'opacity 0.6s ease-out, transform 0.2s ease-out',
          }}
        >
          <img
            src={neermahalImg}
            alt="Neermahal Water Palace"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center ${
              isDark
                ? 'brightness-[0.96] contrast-[1.08] saturate-[1.2]'
                : 'brightness-[1.02] contrast-[1.04] saturate-[1.12]'
            }`}
          />
        </div>

        {/* ================= LAYER 2: Ujjayanta Palace (Royal Reflection Pools) ================= */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: ujjayantaOpacity,
            transform: `translateY(${(scrollRatio - 0.45) * -70}px) scale(${1.03 + Math.abs(scrollRatio - 0.45) * 0.05})`,
            transition: 'opacity 0.6s ease-out, transform 0.2s ease-out',
          }}
        >
          <img
            src={ujjayantaImg}
            alt="Ujjayanta Palace Water Fountains"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center ${
              isDark
                ? 'brightness-[0.96] contrast-[1.08] saturate-[1.2]'
                : 'brightness-[1.02] contrast-[1.04] saturate-[1.12]'
            }`}
          />
        </div>

        {/* ================= LAYER 3: Chabimura & Gomati River Gorge ================= */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: chabimuraOpacity,
            transform: `translateY(${(scrollRatio - 0.85) * -60}px) scale(${1.02 + (1 - scrollRatio) * 0.06})`,
            transition: 'opacity 0.6s ease-out, transform 0.2s ease-out',
          }}
        >
          <img
            src={chabimuraImg}
            alt="Chabimura Gomati River Gorge"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center ${
              isDark
                ? 'brightness-[0.96] contrast-[1.10] saturate-[1.2]'
                : 'brightness-[1.02] contrast-[1.05] saturate-[1.15]'
            }`}
          />
        </div>

        {/* ================= CRYSTALLINE OVERLAYS (Ultra Translucent so background is fully visible) ================= */}
        {/* Light Mode: Gentle water-sky tint without blocking the view */}
        {!isDark && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/15 via-transparent to-sky-100/20 mix-blend-soft-light pointer-events-none" />
        )}

        {/* Dark Mode: Soft sapphire night aura that preserves vibrant colors */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-sky-950/15 to-slate-950/30 pointer-events-none" />
        )}

        {/* Real-time 3D Sunlight & Water Surface Caustics Glint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background: isDark
              ? `radial-gradient(circle at ${50 + mouseTilt.x * 20}% ${30 + mouseTilt.y * 20}%, rgba(56, 189, 248, 0.25), transparent 60%)`
              : `radial-gradient(circle at ${50 + mouseTilt.x * 20}% ${30 + mouseTilt.y * 20}%, rgba(14, 165, 233, 0.22), transparent 65%)`,
          }}
        />

        {/* Traditional Tripura Indigenous Textile Lattice Weave Accent (Rignai 'Mosoroi' Diamond Water Wave) */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] mix-blend-overlay pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="full-tripura-weave" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M24 0 L48 24 L24 48 L0 24 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-sky-900 dark:text-sky-200" />
                <path d="M24 8 L40 24 L24 40 L8 24 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-teal-700 dark:text-cyan-300" />
                <circle cx="24" cy="24" r="2.5" fill="currentColor" className="text-amber-500/70 dark:text-amber-400/70" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#full-tripura-weave)" />
          </svg>
        </div>
      </div>

      {/* ================= FLOATING 3D HERITAGE WATER COMPASS / SCROLL NAVIGATOR ================= */}
      {/* Interactive HUD anchored on screen that highlights the active cultural wonder as you scroll */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto max-w-xs sm:max-w-sm hidden sm:block">
        <div
          className={`p-3 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
            isDark
              ? 'bg-slate-900/85 border-sky-500/40 text-slate-100 shadow-sky-950/50'
              : 'bg-white/90 border-sky-300/80 text-slate-800 shadow-sky-200/60'
          }`}
        >
          {/* Header & District Pill */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/20">
              <Compass className="w-3 h-3 animate-spin text-sky-500" style={{ animationDuration: '14s' }} />
              {landmarkDistrict}
            </span>

            {/* Scroll Progress percentage */}
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {Math.round(scrollRatio * 100)}% Depth
            </span>
          </div>

          {/* Current Landmark Title */}
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
            <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="truncate">{landmarkName}</span>
          </div>

          {/* Brief Hydro Description */}
          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
            {landmarkDesc}
          </p>

          {/* Interactive Quick-Jump Tabs between the 3 Heritages */}
          <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            {LANDMARKS.map((lm, idx) => (
              <button
                key={lm.id}
                type="button"
                onClick={() => scrollToLandmark(lm.targetScroll)}
                title={`Jump to ${lm.nameEn}`}
                className={`flex-1 py-1 px-1.5 rounded-md text-[10px] font-medium transition text-center truncate ${
                  activeLandmarkIndex === idx
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-700'
                }`}
              >
                {idx === 0 ? 'Neermahal' : idx === 1 ? 'Ujjayanta' : 'Chabimura'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
