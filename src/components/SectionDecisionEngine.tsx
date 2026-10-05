import React, { useState } from 'react';
import {
  BrainCircuit,
  ArrowDown,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Cpu,
  Search,
  CheckCircle2
} from 'lucide-react';
import { HydroStation, AdvisoryResponse } from '../types';
import { generateHydrogeologicalAdvisory } from '../utils/advisoryGenerator';
import { useLanguage } from '../context/LanguageContext';

interface SectionDecisionEngineProps {
  station: HydroStation;
}

export const SectionDecisionEngine: React.FC<SectionDecisionEngineProps> = ({ station }) => {
  const { language, t } = useLanguage();
  const [isReRunning, setIsReRunning] = useState(false);
  const [advisory, setAdvisory] = useState<AdvisoryResponse>(() =>
    generateHydrogeologicalAdvisory(station, language)
  );

  // Sync whenever station or language changes
  React.useEffect(() => {
    setAdvisory(generateHydrogeologicalAdvisory(station, language));
  }, [station, language]);

  const handleRerun = () => {
    setIsReRunning(true);
    setTimeout(() => {
      setAdvisory(generateHydrogeologicalAdvisory(station, language));
      setIsReRunning(false);
    }, 600);
  };

  const riskBadgeColor =
    advisory.riskAssessment.level === 'Low'
      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
      : advisory.riskAssessment.level === 'Moderate'
      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
      : 'bg-rose-950/60 text-rose-300 border-rose-500/40';

  return (
    <section
      id="section-analysis"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>PHASE VII • HYDROGEOLOGICAL DECISION ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Should You Drill Here?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Systematic pre-drilling intelligence synthesis combining CGWB decadal water records, stratigraphic modeling, and borehole risk ratings for {station.location}.
          </p>
        </div>

        {/* Engine Status & Re-run Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRerun}
            disabled={isReRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isReRunning ? 'animate-spin' : ''}`} />
            <span>{isReRunning ? 'Synthesizing...' : 'Re-run Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Decision Engine Progressive Briefing Flow:
          OBSERVATION -> INTERPRETATION -> RISK -> RECOMMENDATION */}
      <div className="space-y-6">
        {/* Step 1: OBSERVATION */}
        <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                01
              </span>
              OBSERVATION & REGIONAL STRATIGRAPHY
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
              FIELD TELEMETRY
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            {advisory.formationAnalysis}
          </p>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 z-10 shadow-lg">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: INTERPRETATION */}
        <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-sky-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                02
              </span>
              INTERPRETATION & AQUIFER METRICS
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
              HYDRAULIC SYNTHESIS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase">WATER TABLE DEPTH</div>
              <div className="text-white font-bold text-lg mt-0.5">{station.pre_depth} mbgl</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Pre-monsoon static level</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase">RECOMMENDED TARGET DEPTH</div>
              <div className="text-cyan-300 font-bold text-lg mt-0.5">{advisory.riskAssessment.recommendedDepth}</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Penetrates perennial aquifer</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase">MONSOON FLUCTUATION</div>
              <div className="text-white font-bold text-lg mt-0.5">
                {station.trend_fall > 0 ? `-${station.trend_fall} m/yr` : `+${station.trend_rise} m/yr`}
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">Decadal trend behavior</div>
            </div>
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-sky-500/40 flex items-center justify-center text-sky-400 z-10 shadow-lg">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 3: RISK ASSESSMENT */}
        <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                03
              </span>
              HYDROGEOLOGICAL RISK EVALUATION
            </div>
            <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${riskBadgeColor}`}>
              {advisory.riskAssessment.level} Risk
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            {advisory.riskAssessment.rationale}
          </p>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 z-10 shadow-lg">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 4: ACTIONABLE RECOMMENDATIONS */}
        <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                04
              </span>
              ACTIONABLE ENGINEERING PROTOCOL
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              MANDATORY DIRECTIVES
            </span>
          </div>

          <div className="space-y-3">
            {advisory.preDrillingAdvice.map((advice, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
