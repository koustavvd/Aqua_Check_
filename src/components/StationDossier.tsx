import React, { useState } from 'react';
import { 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  Copy, 
  Check, 
  FileText, 
  MapPin,
  Droplets,
  ArrowDown
} from 'lucide-react';
import { HydroStation } from '../types';
import { getStationRiskCategory, calculateWellDepth } from '../data/tripuraData';
import { VulnerabilitySpeedometer } from './VulnerabilitySpeedometer';
import { useLanguage } from '../context/LanguageContext';
import { WaterTextBg } from './WaterTextBg';

interface StationDossierProps {
  station: HydroStation | null;
}

export const StationDossier: React.FC<StationDossierProps> = ({ station }) => {
  const { t, formatNum, getDistrictName, language } = useLanguage();
  const [copiedPin, setCopiedPin] = useState(false);

  if (!station) {
    return (
      <div className="card-3d-glass rounded-xl p-6 sm:p-8 text-center transition-colors shadow-xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <Droplets className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          <WaterTextBg variant="title">{t.noTownSelectedTitle}</WaterTextBg>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
          {t.noTownSelectedDesc}
        </p>

        <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-lg p-4 text-left space-y-2.5 max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
            <span>{t.howToSelectHint1}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
            <span>{t.howToSelectHint2}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
            <span>{t.howToSelectHint3}</span>
          </div>
        </div>
      </div>
    );
  }

  const riskInfo = getStationRiskCategory(station.risk);
  const isDeclining = station.trend_fall > 0;
  const isPiezometer = station.type === 'PZ';

  // Well depth calculation: water level + 3.5m + 0.8m
  const wellDepth = calculateWellDepth(station.pre_depth);

  const copyPinCode = () => {
    navigator.clipboard.writeText(station.pincode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Subsurface cross-section visualization calculations
  const maxDepthVisual = Math.max(30, Math.ceil((wellDepth + 6) / 5) * 5);
  const waterLevelPercent = Math.min(80, Math.max(15, (station.pre_depth / maxDepthVisual) * 100));

  const localizedRiskDesc = (language === 'bn' || language === 'hi')
    ? (riskInfo.tier === 'low' ? t.vulnerabilityLowDesc : riskInfo.tier === 'moderate' ? t.vulnerabilityModDesc : t.vulnerabilityHighDesc)
    : riskInfo.desc;

  return (
    <div className="card-3d-glass rounded-xl p-4 sm:p-6 transition-all shadow-xl space-y-5">
      {/* Dossier Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {t.stationIdPrefix}{formatNum(station.id)}
            </span>
            <WaterTextBg variant="badge" showDroplet>
              {isPiezometer ? t.piezometerDeep : t.dugWellShallow}
            </WaterTextBg>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span>{station.lat.toFixed(4)}° N, {station.lng.toFixed(4)}° E</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
          <WaterTextBg variant="title">
            {station.location}
          </WaterTextBg>
        </h2>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{station.village}</span>
          <span>•</span>
          <span>{station.block} {t.blockSuffix}</span>
          <span>•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{getDistrictName(station.district)} {t.districtSuffix}</span>
        </div>
      </div>

      {/* Paired Water Level & Well Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Water Level */}
        <div className="p-3.5 rounded-xl bg-sky-100/40 dark:bg-sky-950/25 backdrop-blur-xs border border-sky-300/60 dark:border-sky-500/30 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-900 dark:text-sky-300 font-semibold flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              {t.waterLevel}
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-sky-100/80 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700">
              {t.staticHead}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {formatNum(station.pre_depth)}
            </span>
            <span className="text-sm font-semibold font-mono text-sky-700 dark:text-sky-400">
              {t.meters}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            {t.preMonsoonSub}
          </div>
        </div>

        {/* Well Depth */}
        <div className="p-3.5 rounded-xl bg-emerald-100/35 dark:bg-emerald-950/25 backdrop-blur-xs border border-emerald-300/60 dark:border-emerald-500/30 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-900 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
              <ArrowDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.wellDepth}
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
              {t.wellDepthFormulaBadge}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300">
              {formatNum(wellDepth)}
            </span>
            <span className="text-sm font-semibold font-mono text-slate-700 dark:text-slate-300">
              {t.meters}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-mono">
            {t.wellDepthFormulaDesc(station.pre_depth)}
          </div>
        </div>
      </div>

      {/* Speedometer Vulnerability Gauge */}
      <VulnerabilitySpeedometer score={riskInfo.score} showLegend={true} />

      {/* Secondary Telemetry: Annual Trend & Postal Code */}
      <div className="grid grid-cols-2 gap-3">
        {/* Trend */}
        <div className="p-3 rounded-lg bg-white/45 dark:bg-slate-900/35 backdrop-blur-xs border border-white/60 dark:border-sky-500/20 shadow-xs">
          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {t.annualTrend}
          </div>
          <div className={`text-lg font-bold font-mono mt-1 flex items-center gap-1 ${
            isDeclining ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            {isDeclining ? (
              <>
                <TrendingDown className="w-4 h-4" />
                <span>-{formatNum(station.trend_fall)}</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>+{formatNum(station.trend_rise)}</span>
              </>
            )}
            <span className="text-xs font-normal text-slate-500">m/yr</span>
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
            {isDeclining ? t.drawdownDecline : t.monsoonRecharge}
          </div>
        </div>

        {/* Postal Index & PO */}
        <div className="p-3 rounded-lg bg-white/45 dark:bg-slate-900/35 backdrop-blur-xs border border-white/60 dark:border-sky-500/20 shadow-xs">
          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {t.pincodeLabel}
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 flex items-center justify-between">
            <span>{station.pincode}</span>
            <button
              type="button"
              onClick={copyPinCode}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={t.copyPincode}
            >
              {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={station.post_office}>
            {station.post_office}
          </div>
        </div>
      </div>

      {/* Subsurface Stratigraphic Cross-Section Profile */}
      <div className="p-4 rounded-lg bg-white/45 dark:bg-slate-900/35 backdrop-blur-xs border border-white/60 dark:border-sky-500/20 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <WaterTextBg variant="header">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {t.subsurfaceTitle}
            </span>
          </WaterTextBg>
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
            {t.formation}: <strong className="text-slate-800 dark:text-slate-200">{station.terrain}</strong>
          </span>
        </div>

        {/* Cross-section bar with realistic 3D hydro depth */}
        <div className="relative w-full h-10 rounded-md bg-amber-100/50 dark:bg-amber-950/25 border border-amber-300/50 dark:border-amber-900/50 overflow-hidden flex shadow-inner">
          {/* Vadose Zone (Dry / Aerated topsoil) */}
          <div
            style={{ width: `${waterLevelPercent}%` }}
            className="h-full bg-amber-100/60 dark:bg-amber-900/30 border-r-2 border-dashed border-sky-600 flex items-center justify-center relative group"
          >
            <span className="text-[10px] font-mono text-amber-950 dark:text-amber-200 px-1 truncate font-medium">
              {t.vadoseZone(station.pre_depth)}
            </span>
          </div>

          {/* Saturated Aquifer Zone with natural water current shimmer */}
          <div
            style={{ width: `${100 - waterLevelPercent}%` }}
            className="h-full bg-gradient-to-r from-sky-400/50 via-teal-400/50 to-sky-500/60 dark:from-sky-800/60 dark:via-teal-900/50 dark:to-sky-700/60 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-radial from-sky-300/30 to-transparent animate-pulse opacity-60" />
            <span className="text-[10px] font-mono text-sky-950 dark:text-sky-100 font-semibold px-1 truncate relative z-10 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-600 dark:text-sky-300" />
              {t.saturatedAquifer}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1.5 px-0.5">
          <span>{t.groundLevelZero}</span>
          <span className="text-sky-700 dark:text-sky-400 font-bold">
            {t.markerWaterLevel(station.pre_depth)}
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            {t.markerWellDepth(wellDepth)}
          </span>
        </div>
      </div>

      {/* Field Notes & Lithological Details */}
      <div className="p-3.5 rounded-lg bg-white/45 dark:bg-slate-900/35 backdrop-blur-xs border border-white/60 dark:border-sky-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5 shadow-xs">
        <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div>
            <strong className="text-slate-900 dark:text-white">{t.lithologyHorizon}</strong>
            {station.terrain}
          </div>
          <div>
            <strong className="text-slate-900 dark:text-white">{t.cgwbObserverNote}</strong>
            {station.note}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
            {localizedRiskDesc}
          </div>
        </div>
      </div>
    </div>
  );
};
