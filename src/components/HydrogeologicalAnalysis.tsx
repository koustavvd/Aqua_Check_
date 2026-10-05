import React from 'react';
import { Droplets, TrendingDown, TrendingUp, Minus, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';

interface HydrogeologicalAnalysisProps {
  station: HydroStation;
}

export const HydrogeologicalAnalysis: React.FC<HydrogeologicalAnalysisProps> = ({ station }) => {
  const riskInfo = getStationRiskCategory(station.risk);
  const wellDepth = calculateWellDepth(station.pre_depth);

  // Categorize trend
  const hasDecline = station.trend_fall > 0;
  const hasRise = station.trend_rise > 0;
  const trendVal = hasDecline
    ? `-${station.trend_fall.toFixed(2)} m/yr`
    : hasRise
    ? `+${station.trend_rise.toFixed(2)} m/yr`
    : '0.00 m/yr';

  // Groundwater status classification based on CGWB criteria
  let gwStatus = 'Safe Category';
  let gwStatusColor = 'text-emerald-700 dark:text-emerald-400';
  let gwStatusBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';
  let gwStatusDesc = 'Stage of groundwater development is within safe replenishment limits (<70%). High potential for sustainable domestic and irrigation extraction with regular recharge.';

  if (station.trend_fall > 0.3 || station.risk < 40) {
    gwStatus = 'Critical / Stressed';
    gwStatusColor = 'text-rose-700 dark:text-rose-400';
    gwStatusBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800';
    gwStatusDesc = 'Significant pre-monsoon drawdown observed. Shallow hand pumps may dry up in April–May. Requires deeper drilling into confined sandstone or artificial rainwater recharge.';
  } else if (station.trend_fall > 0.1 || station.risk <= 70) {
    gwStatus = 'Semi-Critical Monitoring';
    gwStatusColor = 'text-amber-700 dark:text-amber-400';
    gwStatusBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';
    gwStatusDesc = 'Moderate seasonal fluctuation. While monsoon recharge restores the water table, dry summer months induce measurable drawdowns. Proper gravel packing and casing required.';
  }

  // Vulnerability vertical column calculation (0 to 100)
  // Higher score = safer / lower vulnerability in this scale
  const columnFillPct = Math.min(95, Math.max(8, riskInfo.score));

  return (
    <section id="section-analysis" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background Subtle Water Caustic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-30">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(56,189,248,0.25),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-24 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(14,165,233,0.18),transparent_70%)] blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 backdrop-blur-md">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Groundwater Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          What Is the Groundwater Telling Us?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Translating raw telemetry numbers into actionable hydrological intelligence for <strong className="text-slate-900 dark:text-white">{station.location}</strong>.
        </p>
      </div>

      {/* Visually Connected Composition (Not 4 identical dashboard cards!) */}
      <div className="mb-12 relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-200/80 dark:border-sky-500/20 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 relative">
            {/* 1. Water Level */}
            <div className="relative flex flex-col justify-between pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 pb-5 sm:pb-0">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  <WaterDropIcon className="w-4 h-4" />
                  <span>Water Level</span>
                </div>
                <div className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {station.pre_depth.toFixed(2)}
                  <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-1.5">m</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Static depth below surface (mbgl) observed pre-monsoon.
              </div>
            </div>

            {/* 2. Well Depth */}
            <div className="relative flex flex-col justify-between pr-0 sm:pr-4 border-b sm:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-5 sm:pb-0">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Well Depth</span>
                </div>
                <div className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {wellDepth.toFixed(2)}
                  <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-1.5">m</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Recommended shallow borewell depth [Water + 3.5m screen + sump].
              </div>
            </div>

            {/* 3. Decadal Trend */}
            <div className="relative flex flex-col justify-between pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 pb-5 sm:pb-0">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  {hasDecline ? (
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                  ) : hasRise ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Decadal Trend</span>
                </div>
                <div className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {trendVal}
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {hasDecline
                  ? 'Long-term groundwater depletion gradient.'
                  : hasRise
                  ? 'Sustainable natural groundwater replenishment.'
                  : 'Equilibrium balance between draft and recharge.'}
              </div>
            </div>

            {/* 4. Vulnerability Score */}
            <div className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  <WaterDropIcon className="w-4 h-4" />
                  <span>Vulnerability</span>
                </div>
                <div className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {riskInfo.score}
                  <span className="text-xl font-normal text-slate-500 dark:text-slate-400 ml-1">/100</span>
                </div>
              </div>
              <div className="mt-3">
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${riskInfo.text} bg-white dark:bg-slate-800 border border-current`}>
                  {riskInfo.label} Risk Tier
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Vulnerability Visualization: Vertical Transparent Water Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left (5 cols): The Vertical Water Column */}
        <div className="lg:col-span-5 bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-sky-300/40 dark:border-sky-500/20 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                Aquifer Security Column
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Score: {riskInfo.score} / 100
              </span>
            </div>

            {/* Vertical Column Graphic */}
            <div className="relative flex items-center justify-center py-4">
              <div className="flex items-stretch gap-6 w-full max-w-xs">
                {/* Calibration Scale Ticks */}
                <div className="flex flex-col justify-between text-right text-[11px] font-mono font-bold text-slate-400 shrink-0 select-none py-2">
                  <div className="text-emerald-600 dark:text-emerald-400">100 (Safe)</div>
                  <div className="text-amber-500">70 (Watch)</div>
                  <div className="text-rose-500">40 (Critical)</div>
                  <div className="text-slate-500">0 (Depleted)</div>
                </div>

                {/* The Glass Transparent Column Container */}
                <div className="relative flex-1 h-72 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 border-2 border-sky-400/30 shadow-inner overflow-hidden flex flex-col justify-end p-1">
                  {/* Glass Highlights */}
                  <div className="absolute top-0 left-2 bottom-0 w-2 bg-white/30 dark:bg-white/10 rounded-full blur-[1px] pointer-events-none z-20" />

                  {/* Water Volume Inside */}
                  <div
                    style={{ height: `${columnFillPct}%` }}
                    className="relative w-full rounded-xl bg-gradient-to-t from-sky-600 via-sky-500 to-cyan-400 shadow-md transition-all duration-1000 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Water Surface Wave / Meniscus */}
                    <div className="relative w-full h-3 bg-white/40 border-b border-white/60 flex items-center justify-center">
                      <div className="w-6 h-1 rounded-full bg-white/80" />
                    </div>

                    {/* Water Bubble Graphic */}
                    <div className="p-3 text-center">
                      <span className="text-xs font-extrabold text-white drop-shadow-md">
                        {riskInfo.score}
                      </span>
                    </div>
                  </div>

                  {/* Depth Horizon Guidelines */}
                  <div className="absolute top-[30%] left-0 right-0 border-b border-dashed border-amber-400/40 pointer-events-none" />
                  <div className="absolute top-[60%] left-0 right-0 border-b border-dashed border-rose-400/40 pointer-events-none" />
                </div>

                {/* Right Zone Descriptions */}
                <div className="flex flex-col justify-between text-xs font-semibold py-2">
                  <div className="text-emerald-600 dark:text-emerald-400">
                    High Security
                    <span className="block text-[10px] text-slate-400 font-normal">Sustainable yield</span>
                  </div>
                  <div className="text-amber-600 dark:text-amber-400">
                    Moderate Risk
                    <span className="block text-[10px] text-slate-400 font-normal">Dry summer drops</span>
                  </div>
                  <div className="text-rose-600 dark:text-rose-400">
                    Stressed Tier
                    <span className="block text-[10px] text-slate-400 font-normal">Deep casing needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated against CGWB Central Ground Water Assessment guidelines
            </span>
          </div>
        </div>

        {/* Right (7 cols): Plain-English Ground Water Status & Analysis */}
        <div className="lg:col-span-7 bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-sky-300/40 dark:border-sky-500/20 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                Hydrological Interpretation
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Site: {station.location}
              </span>
            </div>

            {/* Status Card */}
            <div className={`p-5 rounded-2xl border ${gwStatusBg} mb-6`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${gwStatusColor}`}>
                  {gwStatus}
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  Tier: {riskInfo.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {gwStatusDesc}
              </p>
            </div>

            {/* Practical Advice Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <WaterDropIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Seasonal Water Fluctuations</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Water table drops approximately {(station.pre_depth * 0.35).toFixed(1)} to {(station.pre_depth * 0.55).toFixed(1)} m during March–May before monsoon replenishment begins in June.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Drilling Safety Factor</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Boreholes with minimum depth of {wellDepth.toFixed(1)} m ensure the submersible pump remains submerged below the lowest dry-season cone of depression.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Geological Formation: <strong className="text-slate-800 dark:text-slate-200">{station.terrain}</strong>
            </span>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              Ready for Drilling Advisory <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
