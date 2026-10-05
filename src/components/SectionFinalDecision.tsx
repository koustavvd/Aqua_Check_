import React from 'react';
import {
  ShieldCheck,
  Printer,
  RefreshCw,
  Search,
  ArrowUp,
  FileText,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Compass,
  Sparkles
} from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory, getStationVulnerabilityScore } from '../data/tripuraData';
import { generateHydrogeologicalAdvisory } from '../utils/advisoryGenerator';
import { useLanguage } from '../context/LanguageContext';

interface SectionFinalDecisionProps {
  station: HydroStation;
  onPrintReport: () => void;
  onSearchAnotherLocation: () => void;
  onReRunAnalysis: () => void;
  onReturnToTop: () => void;
}

export const SectionFinalDecision: React.FC<SectionFinalDecisionProps> = ({
  station,
  onPrintReport,
  onSearchAnotherLocation,
  onReRunAnalysis,
  onReturnToTop,
}) => {
  const { language } = useLanguage();
  const advisory = generateHydrogeologicalAdvisory(station, language);
  const waterLevel = station.pre_depth;
  const wellDepth = calculateWellDepth(waterLevel);
  const vulnCategory = getStationRiskCategory(station.risk);
  const vulnScore = getStationVulnerabilityScore(station.risk);

  return (
    <section
      id="section-decision"
      className="relative min-h-screen w-full py-24 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none flex flex-col justify-between"
    >
      {/* Section Header */}
      <div className="max-w-3xl space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PHASE XI • EXECUTIVE HYDROGEOLOGICAL DECISION</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
          Make The Drilling Decision
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Consolidated hydrogeological synthesis and pre-drilling verdict for {station.location}, {station.district} District.
        </p>
      </div>

      {/* Executive Decision Matrix Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-cyan-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              AUTHORIZED CGWB OBSERVATION RECORD
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {station.location} (PIN {station.pincode})
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Station #{station.id} • {station.village}, {station.block} Block • {station.district}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${vulnCategory.border} ${vulnCategory.bg} ${vulnCategory.text}`}>
              {vulnCategory.label} ({vulnScore}/100)
            </span>
          </div>
        </div>

        {/* 7-Point Synthesis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* 1. Location */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider block">1. LOCATION</span>
            <div className="text-white font-bold text-sm truncate">{station.location}</div>
            <div className="text-slate-400 text-[11px]">{station.lat.toFixed(4)}°N, {station.lng.toFixed(4)}°E</div>
          </div>

          {/* 2. Groundwater Status */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider block">2. GROUNDWATER STATUS</span>
            <div className="text-cyan-300 font-bold text-sm">{station.pre_depth} mbgl Static Head</div>
            <div className="text-slate-400 text-[11px]">
              {station.trend_fall > 0 ? `Drawdown decline: -${station.trend_fall} m/yr` : `Recharge: +${station.trend_rise} m/yr`}
            </div>
          </div>

          {/* 3. Vulnerability */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider block">3. VULNERABILITY SCORE</span>
            <div className="text-emerald-300 font-bold text-sm">{vulnScore} / 100 ({vulnCategory.tier})</div>
            <div className="text-slate-400 text-[11px] truncate">{vulnCategory.desc}</div>
          </div>

          {/* 4. Target Aquifer */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider block">4. TARGET AQUIFER</span>
            <div className="text-white font-bold text-sm truncate">{station.terrain}</div>
            <div className="text-slate-400 text-[11px]">Semi-consolidated sandstone horizons</div>
          </div>

          {/* 5. Recommended Depth */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
            <span className="text-cyan-400 uppercase text-[10px] tracking-wider block">5. RECOMMENDED DRILLING DEPTH</span>
            <div className="text-cyan-200 font-bold text-sm">{advisory.riskAssessment.recommendedDepth}</div>
            <div className="text-cyan-300/70 text-[11px]">Shallow tube well baseline: {wellDepth} m</div>
          </div>

          {/* 6. Key Risks */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <span className="text-amber-400 uppercase text-[10px] tracking-wider block">6. KEY RISKS & MITIGATION</span>
            <div className="text-amber-200 font-bold text-sm">
              {station.trend_fall > 0.1 ? 'Rapid Summer Drawdown' : 'Dissolved Iron Fe > 1.0 mg/L'}
            </div>
            <div className="text-amber-300/70 text-[11px]">Install aeration filter & slotted screen</div>
          </div>
        </div>

        {/* 7. Next Step Verdict Banner */}
        <div className="p-5 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                FINAL HYDROGEOLOGICAL VERDICT
              </div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-sans">
                Approved for rotary bored tube well with slotted screen across {advisory.riskAssessment.recommendedDepth}.
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onPrintReport}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>PRINT HYDROGEOLOGICAL REPORT</span>
            </button>

            <button
              type="button"
              onClick={onReRunAnalysis}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-200 border border-white/10 hover:border-cyan-400/40 text-xs font-mono transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>RE-RUN ANALYSIS</span>
            </button>

            <button
              type="button"
              onClick={onSearchAnotherLocation}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-200 border border-white/10 hover:border-cyan-400/40 text-xs font-mono transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>SEARCH ANOTHER LOCATION</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onReturnToTop}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>RETURN TO SURFACE (0.0 m)</span>
          </button>
        </div>
      </div>

      {/* Scientific Footer */}
      <footer className="pt-12 text-center text-xs font-mono text-slate-500 space-y-1">
        <div>TRIPURA GROUNDWATER INTELLIGENCE • CENTRAL GROUND WATER BOARD (CGWB) NER</div>
        <div>State Ground Water Authority, Agartala • WGS-84 Datum • High-Performance WebGL & Spatial Telemetry</div>
      </footer>
    </section>
  );
};
