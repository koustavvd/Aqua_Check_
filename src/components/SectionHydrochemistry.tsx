import React from 'react';
import { Beaker, Droplets, AlertTriangle, ShieldCheck, Sparkles, Filter, FlaskConical } from 'lucide-react';
import { HydroStation } from '../types';
import { generateHydrogeologicalAdvisory } from '../utils/advisoryGenerator';
import { useLanguage } from '../context/LanguageContext';

interface SectionHydrochemistryProps {
  station: HydroStation;
}

export const SectionHydrochemistry: React.FC<SectionHydrochemistryProps> = ({ station }) => {
  const { language } = useLanguage();
  const advisory = generateHydrogeologicalAdvisory(station, language);

  return (
    <section
      id="section-hydrochemistry"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="max-w-2xl mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>PHASE IX • UNDERGROUND HYDROCHEMISTRY & WATER QUALITY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Aquifer Chemical Profile
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Subsurface chemical analysis and dissolved mineral parameters across the sedimentary series in {station.district} District.
        </p>
      </div>

      {/* Main Grid: Laboratory Indicators + Mitigation Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Water Quality Parameter Gauges */}
        <div className="lg:col-span-6 space-y-4">
          {/* Iron Parameter Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-amber-400" />
                DISSOLVED IRON (Fe) CONCENTRATION
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-500/40">
                ELEVATED RISK
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-bold text-white">
              Fe &gt; 1.0 <span className="text-sm font-normal text-amber-300">mg/L</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Groundwater within the Tipam/Surma series frequently exhibits dissolved ferrous iron (Fe²⁺) under reducing subterranean aquifer conditions. Contact with air oxidizes it into ferric hydroxide precipitates.
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>WHO / BIS Permissible Limit: 0.3 mg/L (Aeration recommended)</span>
            </div>
          </div>

          {/* Turbidity & Micaceous Silt Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-400" />
                TURBIDITY & MICACEOUS SILT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                MONITORED
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
              Fine Suspended Mica & Silt
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Micaceous silt from disintegrating sandstones can cause colloidal turbidity in newly drilled boreholes if annular pea-gravel packing is undersized.
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-cyan-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Solution: 2.0–3.5mm pea-gravel pack & 4-hour compressor surging</span>
            </div>
          </div>
        </div>

        {/* Right Side: Laboratory Advisory & Aeration Filtration Blueprint */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-cyan-400" />
              TREATMENT & FILTRATION DIRECTIVE
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Atmospheric Aeration & Sand-Gravel Filter
            </h3>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {advisory.waterQualityNotes}
            </p>

            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                  A
                </span>
                <div>
                  <div className="text-white font-semibold">Aeration Cascading Tray</div>
                  <div className="text-slate-400 text-[11px]">Oxidizes soluble ferrous iron (Fe²⁺) to insoluble ferric iron (Fe³⁺).</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                  B
                </span>
                <div>
                  <div className="text-white font-semibold">Quartz Sand & Gravel Bed</div>
                  <div className="text-slate-400 text-[11px]">Traps precipitated iron flocs and reduces turbidity below 1.0 NTU.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                  C
                </span>
                <div>
                  <div className="text-white font-semibold">Periodic Backwashing</div>
                  <div className="text-slate-400 text-[11px]">Weekly reversing of water flow to flush accumulated iron sludge.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
