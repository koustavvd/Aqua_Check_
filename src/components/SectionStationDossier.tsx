import React, { useState } from 'react';
import {
  MapPin,
  Droplets,
  Gauge,
  TrendingDown,
  TrendingUp,
  Minus,
  Copy,
  Check,
  Compass,
  Layers,
  FileText,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory, getStationVulnerabilityScore } from '../data/tripuraData';
import { VulnerabilitySpeedometer } from './VulnerabilitySpeedometer';
import { useLanguage } from '../context/LanguageContext';

interface SectionStationDossierProps {
  station: HydroStation;
}

export const SectionStationDossier: React.FC<SectionStationDossierProps> = ({ station }) => {
  const { t, formatNum } = useLanguage();
  const [copied, setCopied] = useState(false);

  const waterLevel = station.pre_depth;
  const wellDepth = calculateWellDepth(waterLevel);
  const vulnScore = getStationVulnerabilityScore(station.risk);
  const vulnCategory = getStationRiskCategory(station.risk);

  const handleCopyPincode = () => {
    navigator.clipboard.writeText(station.pincode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="section-station-dossier"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Sub-heading */}
      <div className="max-w-2xl mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>PHASE V • TELEMETRIC DOSSIER</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Station Intelligence
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Direct sensor readings, static water depth, calculated well casing specifications, and vulnerability index for Station #{station.id}.
        </p>
      </div>

      {/* Main Grid: Left Map/Location Context + Right Detailed Intelligence Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Spatial Location Badge & Radial Vulnerability Gauge */}
        <div className="lg:col-span-5 space-y-6">
          {/* Station Overview Card */}
          <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                  CGWB STATION #{station.id}
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                  {station.location}
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {station.village}, {station.block} Block
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                station.type === 'DUG'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                  : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
              }`}>
                {station.type === 'DUG' ? 'Dug Well' : 'Piezometer'}
              </span>
            </div>

            {/* Coordinates & PIN code */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">DISTRICT</div>
                <div className="text-white font-semibold truncate">{station.district}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">PIN CODE</div>
                  <div className="text-cyan-300 font-semibold">{station.pincode}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPincode}
                  title="Copy PIN Code"
                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-cyan-200 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">LATITUDE</div>
                <div className="text-slate-200">{station.lat.toFixed(4)}° N</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">LONGITUDE</div>
                <div className="text-slate-200">{station.lng.toFixed(4)}° E</div>
              </div>
            </div>
          </div>

          {/* Large Radial Vulnerability Visualization */}
          <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                AQUIFER VULNERABILITY INDEX
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${vulnCategory.border} ${vulnCategory.bg} ${vulnCategory.text}`}>
                {vulnCategory.label}
              </span>
            </div>

            <VulnerabilitySpeedometer score={vulnScore} size="lg" showLegend={true} />

            <p className="text-xs text-slate-300 font-mono leading-relaxed pt-2 border-t border-white/10">
              {vulnCategory.desc}
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Engineering Telemetry Metrics & Lithology */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hydro Telemetry Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Water Level */}
            <div className="p-5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  STATIC WATER LEVEL
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                  PRE-MONSOON
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white">
                {waterLevel} <span className="text-sm font-light text-cyan-300">mbgl</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Depth to phreatic water surface from natural ground level.
              </p>
            </div>

            {/* Metric 2: Calculated Well Depth */}
            <div className="p-5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <Gauge className="w-3.5 h-3.5 text-sky-400" />
                  CALCULATED WELL DEPTH
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30">
                  WL + 3.5m + 0.8m
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white">
                {wellDepth} <span className="text-sm font-light text-sky-300">meters</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Formula: {waterLevel}m (WL) + 3.5m (strainer) + 0.8m (sediment sump).
              </p>
            </div>

            {/* Metric 3: Annual Fluctuation Trend */}
            <div className="p-5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  ANNUAL DECADAL TREND
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-white/10">
                  m / YEAR
                </span>
              </div>
              <div className="flex items-center gap-2">
                {station.trend_fall > 0 ? (
                  <>
                    <TrendingDown className="w-6 h-6 text-rose-400" />
                    <span className="text-2xl font-mono font-bold text-rose-300">
                      -{station.trend_fall} m/yr
                    </span>
                  </>
                ) : station.trend_rise > 0 ? (
                  <>
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    <span className="text-2xl font-mono font-bold text-emerald-300">
                      +{station.trend_rise} m/yr
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="w-6 h-6 text-cyan-300" />
                    <span className="text-2xl font-mono font-bold text-cyan-300">
                      0.00 m/yr
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                {station.trend_fall > 0
                  ? 'Seasonal drawdown rate requiring deeper casing pipe.'
                  : 'Positive natural replenishment from seasonal rainfall.'}
              </p>
            </div>

            {/* Metric 4: Risk Index */}
            <div className="p-5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  CGWB RISK SCORE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-white/10">
                  0 - 100
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {station.risk} / 100
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Inverse vulnerability weighting based on regional drawdown.
              </p>
            </div>
          </div>

          {/* Subsurface Lithological Formation & Field Observer Note */}
          <div className="p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-cyan-400" />
              LITHOLOGICAL HORIZON & OBSERVER RECORD
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Geological Formation
              </div>
              <div className="text-base font-mono font-bold text-white mt-0.5">
                {station.terrain}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                CGWB Field Observer Notes
              </div>
              <div className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                "{station.note}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
