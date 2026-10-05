import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight, Wrench, Target, Compass } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';

interface DrillingRecommendationSectionProps {
  station: HydroStation;
  onExploreTechSpecs: () => void;
}

export const DrillingRecommendationSection: React.FC<DrillingRecommendationSectionProps> = ({
  station,
  onExploreTechSpecs,
}) => {
  const riskInfo = getStationRiskCategory(station.risk);
  const wellDepth = calculateWellDepth(station.pre_depth);

  // Determine drilling verdict
  type VerdictType = 'RECOMMENDED' | 'CAUTION' | 'NOT RECOMMENDED';
  let verdict: VerdictType = 'RECOMMENDED';
  let successProb = '92%';
  let aquiferThickness = '18 – 24 m';
  let drillingMethod = 'Direct Mud Rotary (150 mm uPVC)';
  let verdictSubtext = 'Highly favorable hydrological conditions. Stable unconfined water table with perennial yield across seasons.';
  let verdictTheme = {
    badge: 'bg-emerald-500 text-white shadow-emerald-500/30',
    border: 'border-emerald-500/30',
    bg: 'from-emerald-950/20 via-slate-900/60 to-slate-950/80',
    glow: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  };

  if (riskInfo.tier === 'high') {
    verdict = 'CAUTION';
    successProb = '58%';
    aquiferThickness = '8 – 14 m (Discontinuous)';
    drillingMethod = 'Reverse Mud Rotary / DTH Rig';
    verdictSubtext = 'High vulnerability zone. Shallow water table is subject to seasonal depletion. Requires deep borehole into confined sandstone.';
    verdictTheme = {
      badge: 'bg-rose-500 text-white shadow-rose-500/30',
      border: 'border-rose-500/30',
      bg: 'from-rose-950/20 via-slate-900/60 to-slate-950/80',
      glow: 'bg-rose-500/10',
      textColor: 'text-rose-600 dark:text-rose-400',
    };
  } else if (riskInfo.tier === 'moderate') {
    verdict = 'CAUTION';
    successProb = '79%';
    aquiferThickness = '14 – 18 m';
    drillingMethod = 'Direct Rotary with Mud Circulation';
    verdictSubtext = 'Feasible with proper engineering. Water table drops during summer dry months; install casing past shallow sand layers.';
    verdictTheme = {
      badge: 'bg-amber-500 text-white shadow-amber-500/30',
      border: 'border-amber-500/30',
      bg: 'from-amber-950/20 via-slate-900/60 to-slate-950/80',
      glow: 'bg-amber-500/10',
      textColor: 'text-amber-600 dark:text-amber-400',
    };
  }

  return (
    <section id="section-drilling" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-40">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] ${verdictTheme.glow} blur-[120px] rounded-full`} />
      </div>

      {/* Section Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 backdrop-blur-md">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Hydrogeological Pre-Drilling Verdict</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Should You Drill Here?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Decisive, data-backed feasibility guidance for landowners, farmers, and drilling engineers.
        </p>
      </div>

      {/* Main Bold Decisive Layout */}
      <div className={`relative z-10 rounded-3xl bg-gradient-to-b ${verdictTheme.bg} backdrop-blur-xl border ${verdictTheme.border} p-6 sm:p-10 shadow-2xl overflow-hidden`}>
        {/* Top Verdict Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/20 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Borewell Feasibility Verdict for {station.location}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className={`px-6 py-2.5 rounded-full text-lg sm:text-xl font-black tracking-wider uppercase shadow-lg ${verdictTheme.badge}`}>
                {verdict}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white">
                {station.district} District
              </span>
            </div>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {verdictSubtext}
            </p>
          </div>

          {/* Quick Score Tag */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/15 p-5 min-w-[200px] text-center md:text-right shrink-0">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">Aquifer Safety Score</span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {riskInfo.score} <span className="text-base font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 mt-1 block">
              {riskInfo.label} Risk Profile
            </span>
          </div>
        </div>

        {/* 4 Core Quantitative Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-slate-200/20 dark:border-slate-800">
          {/* 1. Recommended Depth */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">1. Recommended Depth</span>
            <div className="text-2xl font-bold text-white mt-1">
              {wellDepth.toFixed(1)} m
            </div>
            <span className="text-xs text-slate-300 mt-1 block">
              Minimum casing penetration (Water table at {station.pre_depth.toFixed(2)}m)
            </span>
          </div>

          {/* 2. Success Probability */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">2. Estimated Success</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {successProb}
            </div>
            <span className="text-xs text-slate-300 mt-1 block">
              Likelihood of hitting perennial potable groundwater
            </span>
          </div>

          {/* 3. Aquifer Thickness */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">3. Aquifer Thickness</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">
              {aquiferThickness}
            </div>
            <span className="text-xs text-slate-300 mt-1 block">
              Porous sandstone storage horizon
            </span>
          </div>

          {/* 4. Drilling Method */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">4. Drilling Method</span>
            <div className="text-lg font-bold text-white mt-1 leading-snug">
              {drillingMethod}
            </div>
            <span className="text-xs text-slate-300 mt-1 block">
              Standard equipment for Tripura soft rocks
            </span>
          </div>
        </div>

        {/* Realistic Borehole Engineering Diagram */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white tracking-wide">
                Borehole Engineering Blueprint
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              ISO / CGWB Standard Tube Well Construction
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Blueprint Diagram (6 cols) */}
            <div className="lg:col-span-6 bg-slate-950/80 rounded-2xl p-6 border border-white/10 flex flex-col items-center">
              {/* Ground level line */}
              <div className="w-full border-b-2 border-dashed border-amber-600/80 pb-1 flex justify-between text-[11px] font-mono text-amber-400 font-bold">
                <span>▼ Ground Surface (0.0 m)</span>
                <span>Sanitary Cement Grout Seal</span>
              </div>

              {/* Physical Borehole Column */}
              <div className="relative w-40 my-3 flex flex-col items-center">
                {/* 1. Solid Upper Casing */}
                <div className="w-16 h-20 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-x-2 border-slate-600 rounded-t-sm flex items-center justify-center relative shadow-md">
                  <span className="text-[10px] font-mono font-bold text-slate-900 rotate-90 whitespace-nowrap">
                    150mm Casing
                  </span>
                  {/* Outer Grout Annulus */}
                  <div className="absolute -left-3 top-0 bottom-0 w-3 bg-stone-700/60 border-l border-dashed border-stone-500" />
                  <div className="absolute -right-3 top-0 bottom-0 w-3 bg-stone-700/60 border-r border-dashed border-stone-500" />
                </div>

                {/* Submersible Pump Position Marker */}
                <div className="w-20 py-1 bg-blue-600 text-white rounded-md text-[10px] font-bold text-center shadow-lg border border-blue-300 animate-pulse my-1 z-20">
                  ▲ Submersible Pump ({((station.pre_depth + wellDepth) / 2 - 1).toFixed(1)} m)
                </div>

                {/* 2. Filter Screen Section */}
                <div className="w-16 h-28 bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-300 border-x-2 border-sky-600 relative flex items-center justify-center shadow-md">
                  {/* Slotted filter screen pattern */}
                  <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(2,132,199,0.7)_4px,rgba(2,132,199,0.7)_6px)]" />
                  <span className="absolute text-[10px] font-mono font-bold text-sky-950 bg-white/70 px-1 rounded rotate-90 whitespace-nowrap">
                    0.5mm Slotted Screen
                  </span>

                  {/* Outer Gravel Pack Annulus */}
                  <div className="absolute -left-4 top-0 bottom-0 w-4 bg-amber-800/60 border-l border-amber-600 flex items-center justify-center">
                    <div className="w-1 h-full bg-[radial-gradient(circle,#fbbf24_1px,transparent_1px)] bg-[size:4px_4px]" />
                  </div>
                  <div className="absolute -right-4 top-0 bottom-0 w-4 bg-amber-800/60 border-r border-amber-600 flex items-center justify-center">
                    <div className="w-1 h-full bg-[radial-gradient(circle,#fbbf24_1px,transparent_1px)] bg-[size:4px_4px]" />
                  </div>
                </div>

                {/* 3. Bottom Sump Pipe */}
                <div className="w-16 h-8 bg-slate-500 border-x-2 border-b-2 border-slate-700 rounded-b-md flex items-center justify-center">
                  <span className="text-[9px] font-mono text-white font-bold">Sump Pipe (1.5m)</span>
                </div>
              </div>

              {/* Total Depth Base */}
              <div className="w-full border-t border-sky-500/50 pt-1 flex justify-between text-[11px] font-mono text-sky-400">
                <span>▲ Borehole Base: {wellDepth.toFixed(1)} m</span>
                <span>Water Meniscus: {station.pre_depth.toFixed(2)} m</span>
              </div>
            </div>

            {/* Right Blueprint Engineering Specifications (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              {/* Spec 1: Casing */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-900 font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sanitary Surface Casing (150 mm)</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Heavy-duty class-9 uPVC casing sealed with 3m neat cement grout to block surface runoff and agricultural pesticides.
                  </p>
                </div>
              </div>

              {/* Spec 2: Filter Screen */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-sky-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Continuous Wire-Wound Screen (0.5 mm)</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Continuous V-wire slot design placed from {station.pre_depth.toFixed(1)}m to {(wellDepth - 1.5).toFixed(1)}m, allowing sand-free inflow without clogs.
                  </p>
                </div>
              </div>

              {/* Spec 3: Gravel Pack */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Graded Pea Gravel Pack (2.0 – 3.5 mm)</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Clean, rounded quartz gravel packed in the annular space between borehole wall and screen to filter micaceous Tripura sands.
                  </p>
                </div>
              </div>

              {/* Spec 4: Submersible Pump */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Pump Intake Positioning</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Position pump 2.0m above the top of the slotted screen to prevent turbulence and fine sand entry into the motor.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onExploreTechSpecs}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Explore Detailed Technical Accordions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
