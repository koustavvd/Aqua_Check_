import React from 'react';
import { Printer, RefreshCw, Search, CheckCircle2, ShieldCheck, MapPin, Target, Layers } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';

interface FinalDecisionSectionProps {
  station: HydroStation;
  onPrintReport: () => void;
  onRerunAnalysis: () => void;
  onSearchAnother: () => void;
}

export const FinalDecisionSection: React.FC<FinalDecisionSectionProps> = ({
  station,
  onPrintReport,
  onRerunAnalysis,
  onSearchAnother,
}) => {
  const riskInfo = getStationRiskCategory(station.risk);
  const wellDepth = calculateWellDepth(station.pre_depth);

  const riskBadgeClass =
    riskInfo.tier === 'low'
      ? 'bg-emerald-600 text-white'
      : riskInfo.tier === 'moderate'
      ? 'bg-amber-500 text-white'
      : 'bg-rose-600 text-white';

  return (
    <section id="section-decision" className="relative py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Visual Ambient Divider */}
      <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full mx-auto mb-10" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Executive Summary</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your Groundwater Decision
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Hydrogeological briefing card ready for field implementation and borehole contracting.
        </p>
      </div>

      {/* Decision Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Target Well Site</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {station.location}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {station.district} District • {station.block} Block • PIN {station.pincode}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider ${riskBadgeClass}`}>
              {riskInfo.tier.toUpperCase()} RISK
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              Score: {riskInfo.score}/100
            </span>
          </div>
        </div>

        {/* Key Decision Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Static Water Level
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
              {station.pre_depth.toFixed(2)} m
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Meters below ground level
            </span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80">
            <span className="text-[11px] font-semibold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
              Target Well Depth
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
              {wellDepth.toFixed(2)} m
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Includes screen &amp; sump clearance
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Hydrogeological Status
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block truncate">
              {station.trend_fall > 0.2 ? 'Critical Drawdown' : 'Safe Sustainable'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {station.trend_fall > 0 ? `-${station.trend_fall.toFixed(2)} m/yr` : `+${station.trend_rise.toFixed(2)} m/yr`}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              Recommended Action
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
              Rotary Tube Well
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              150mm Casing + Gravel Pack
            </span>
          </div>
        </div>

        {/* Definitive Summary Advice */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Field Implementation Protocol:</strong> Before beginning borehole excavation, verify seasonal pump tests and install continuous 0.50–0.75 mm slotted uPVC casing. If pumped water exhibits iron odor or reddish precipitation after resting, pass output through a simple gravity sand-and-gravel aeration filter.
          </p>
        </div>

        {/* The 3 Core Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Button 1: Print Report */}
          <button
            type="button"
            onClick={onPrintReport}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          {/* Button 2: Re-run Analysis */}
          <button
            type="button"
            onClick={onRerunAnalysis}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-sky-600" />
            <span>Re-run Analysis</span>
          </button>

          {/* Button 3: Search Another Location */}
          <button
            type="button"
            onClick={onSearchAnother}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-sky-600" />
            <span>Search Another Location</span>
          </button>
        </div>
      </div>

      {/* Clean Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>
          AQUA CHECK — Tripura Groundwater Intelligence &amp; CGWB Observation Network
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Data compiled from Central Ground Water Board (CGWB) &amp; State Water Investigation Directorate.
        </p>
      </footer>
    </section>
  );
};
