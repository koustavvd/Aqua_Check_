import React from 'react';
import { Printer, Search, FileText, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface SectionFinalReportProps {
  station: HydroStation;
  onSearchAnother: () => void;
  onPrint: () => void;
}

export const SectionFinalReport: React.FC<SectionFinalReportProps> = ({
  station,
  onSearchAnother,
  onPrint,
}) => {
  const wellDepth = calculateWellDepth(station.pre_depth);
  const riskInfo = getStationRiskCategory(station.risk);

  return (
    <section id="section-report" className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* 1. Full-Width Heritage Photograph Background: Chabimura Gomati River Water */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={IMAGES.chabimuraGomatiWater}
          alt="Chabimura Gorge and Fresh Gomati River Water, Tripura"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.05]"
        />
        {/* Soft dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sky-200 text-xs font-semibold mb-4">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Final Hydrogeological Dossier</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          Groundwater Intelligence Report
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto font-normal">
          Synthesized pre-drilling report ready for field engineers and local decision-makers.
        </p>

        {/* 3. Executive Report Card */}
        <div className="mt-10 rounded-3xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-left">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <span className="text-xs font-mono text-sky-300 uppercase tracking-wider block">
                Official Report #TR-{station.pincode}-{station.id}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {station.location}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{station.village}, {station.district} District • PIN {station.pincode}</span>
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Assessment Verdict</span>
              <span className="text-sm font-bold text-white">{riskInfo.label} Risk Tier</span>
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-white/15 text-xs">
            <div>
              <span className="text-slate-400 block">Depth to Water</span>
              <span className="text-base font-bold text-white mt-0.5 block">{station.pre_depth.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-slate-400 block">Borehole Target</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{wellDepth.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-slate-400 block">Aquifer Security</span>
              <span className="text-base font-bold text-white mt-0.5 block">{riskInfo.score} / 100</span>
            </div>
            <div>
              <span className="text-slate-400 block">Telemetry Agency</span>
              <span className="text-base font-bold text-sky-300 mt-0.5 block">CGWB NER</span>
            </div>
          </div>

          {/* Environmental Compliance Note */}
          <div className="mt-6 flex items-start gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All drilling and borehole construction must comply with the Central Ground Water Authority (CGWA) guidelines for the state of Tripura. Implement mandatory rainwater harvesting recharge pits for all commercial installations.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onPrint}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Official Report</span>
            </button>

            <button
              type="button"
              onClick={onSearchAnother}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-sky-300" />
              <span>Search Another Location</span>
            </button>
          </div>
        </div>

        {/* Minimal Footer Credits */}
        <div className="mt-16 text-center text-xs text-slate-400/80 space-y-1">
          <p>Aqua Check — Tripura Groundwater Intelligence &amp; Telemetry Platform</p>
          <p className="text-[11px] text-slate-500">
            Data sourced from Central Ground Water Board (CGWB) &amp; Department of Drinking Water and Sanitation, Govt. of India.
          </p>
        </div>
      </div>
    </section>
  );
};
