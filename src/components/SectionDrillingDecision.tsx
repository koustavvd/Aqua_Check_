import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, ChevronDown, ChevronUp, CheckCircle2, Wrench } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface SectionDrillingDecisionProps {
  station: HydroStation;
}

export const SectionDrillingDecision: React.FC<SectionDrillingDecisionProps> = ({ station }) => {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const wellDepth = calculateWellDepth(station.pre_depth);
  const riskInfo = getStationRiskCategory(station.risk);

  // Status mapping
  const statusConfig = {
    low: {
      label: 'SAFE TO DRILL',
      sublabel: 'Favorable Aquifer Conditions',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      explanation:
        'Groundwater conditions at this location show robust aquifer recharge and low vulnerability. Standard rotary or percussion drilling is suitable with minimal drawdown hazard.',
    },
    moderate: {
      label: 'DRILL WITH CAUTION',
      sublabel: 'Seasonal Drawdown Noted',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      explanation:
        'Groundwater conditions indicate seasonal drawdown and moderate vulnerability. Extend borehole casing beyond the top weather layer and install an engineered sand screen.',
    },
    high: {
      label: 'HIGH RISK — ADVISORY',
      sublabel: 'Elevated Vulnerability Detected',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: <XCircle className="w-5 h-5 text-rose-400" />,
      explanation:
        'Groundwater conditions indicate elevated vulnerability and substantial seasonal depletion. Deep drilling with sanitary cement grouting and hydrological clearance is strongly advised.',
    },
  }[riskInfo.tier];

  return (
    <section id="section-decision" className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* 1. Full-Width Heritage Photograph Background: Unakoti Rock Carvings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={IMAGES.unakotiTripuraHeritage}
          alt="Unakoti Ancient Rock Carvings & Heritage Water Stream, Tripura"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.05]"
        />
        {/* Soft translucent dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/85 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sky-200 text-xs font-semibold mb-4">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Pre-Drilling Feasibility Assessment</span>
        </div>

        {/* The Requested Headline */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          Should You Drill Here?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto font-normal">
          Automated hydrogeological verdict synthesized for {station.location}.
        </p>

        {/* 3. The Decision Card */}
        <div className="mt-10 rounded-3xl bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-left">
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                {statusConfig.icon}
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeBg}`}>
                  {statusConfig.label}
                </span>
                <div className="text-sm font-semibold text-white mt-1">
                  {statusConfig.sublabel}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Vulnerability</span>
                <span className="text-xl font-bold text-white">{riskInfo.score} / 100</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Recommended Depth</span>
                <span className="text-xl font-bold text-emerald-400">{wellDepth.toFixed(2)} m</span>
              </div>
            </div>
          </div>

          {/* Short Explanation */}
          <p className="mt-6 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {statusConfig.explanation}
          </p>

          {/* Button: View Drilling Recommendation */}
          <div className="mt-8 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => setShowRecommendation(!showRecommendation)}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>{showRecommendation ? 'Hide Drilling Specification' : 'View Drilling Recommendation'}</span>
              {showRecommendation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Engineering Recommendations */}
          {showRecommendation && (
            <div className="mt-8 pt-6 border-t border-white/15 space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-sky-400" />
                <span>Engineered Drilling Protocol Specification</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                  <span className="text-sky-300 font-bold block mb-1">Target Horizon</span>
                  <p className="text-slate-300 leading-relaxed">
                    Tap first confined sandstone stratum at depth between <strong>{wellDepth.toFixed(1)} m</strong> and <strong>{(wellDepth + 6).toFixed(1)} m</strong> below ground.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                  <span className="text-sky-300 font-bold block mb-1">Recommended Rig / Method</span>
                  <p className="text-slate-300 leading-relaxed">
                    Direct mud rotary drilling or combination DTH rig depending on presence of boulder / hard sandstone ribs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                  <span className="text-sky-300 font-bold block mb-1">Casing &amp; Screen Assembly</span>
                  <p className="text-slate-300 leading-relaxed">
                    125 mm – 150 mm UPVC / ERW steel casing. Install continuous slot wire-wrapped screen (0.50 mm slot aperture) across productive sand interval.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                  <span className="text-sky-300 font-bold block mb-1">Gravel Packing &amp; Sanitary Grout</span>
                  <p className="text-slate-300 leading-relaxed">
                    Grade-sorted river silica gravel pack (1.5 mm to 3.0 mm). Top 3.0 m must be sealed with neat cement-bentonite grout against surface contamination.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
