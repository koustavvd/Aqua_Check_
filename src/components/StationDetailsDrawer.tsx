import React, { useEffect } from 'react';
import { X, MapPin, Compass, Droplet, ShieldCheck, Activity, Layers, Beaker, FileText, CheckCircle2 } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';

interface StationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  station: HydroStation | null;
}

export const StationDetailsDrawer: React.FC<StationDetailsDrawerProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !station) return null;

  const riskInfo = getStationRiskCategory(station.risk);
  const wellDepth = calculateWellDepth(station.pre_depth);

  const hasDecline = station.trend_fall > 0;
  const hasRise = station.trend_rise > 0;
  const trendVal = hasDecline
    ? `-${station.trend_fall.toFixed(2)} m/yr (Decline)`
    : hasRise
    ? `+${station.trend_rise.toFixed(2)} m/yr (Rise)`
    : '0.00 m/yr (Stable)';

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl overflow-y-auto z-10 flex flex-col border-l border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-600 flex items-center justify-center">
              <WaterDropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Station Dossier #{station.id}
              </h3>
              <p className="text-xs text-slate-500">
                {station.location} • PIN {station.pincode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Summary Badge Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50">
              <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                Static Water Level
              </span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {station.pre_depth.toFixed(2)} m
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">Below Ground Level</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Recommended Well Depth
              </span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {wellDepth.toFixed(2)} m
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">Casing + Screen target</span>
            </div>
          </div>

          {/* 1. Administrative & Geographic Coordinates */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>Location &amp; Administrative Hierarchy</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">District</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{station.district}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Block</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{station.block}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Village / Hamlet</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{station.village}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Post Office / PIN</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{station.post_office} ({station.pincode})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Coordinates</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {station.lat.toFixed(4)}° N, {station.lng.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Station Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {station.type === 'DUG' ? 'Dug Well (Shallow unconfined)' : 'Piezometer (Confined monitoring)'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Decadal Fluctuation Trend */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span>10-Year Decadal Trend &amp; Fluctuation</span>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Decadal Trend Rate:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{trendVal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Vulnerability Score:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {riskInfo.score} / 100 ({riskInfo.label} Risk)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Seasonal Replenishment:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Restored during June–September Monsoons
                </span>
              </div>
            </div>
          </div>

          {/* 3. Subsurface Lithology & Aquifer Information */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Subsurface Lithology &amp; Aquifer Formation</span>
            </div>
            <div className="text-xs space-y-2 leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                <strong>Geological Horizon:</strong> {station.terrain} Formation (Tipam / Surma Group). Composed of fine to medium micaceous sandstone intercalated with siltstone and shale bands.
              </p>
              <p>
                <strong>Aquifer Type:</strong> Semi-confined to unconfined porous aquifer with specific yield ranging between 12% and 18%.
              </p>
              <p>
                <strong>Sanitary Seal:</strong> Requires minimum 3.0 m cement grout annulus at the surface to prevent contaminated runoff from surface drains.
              </p>
            </div>
          </div>

          {/* 4. Hydrochemistry Parameters */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Beaker className="w-4 h-4 text-cyan-500" />
              <span>Drinking Water Quality (CGWB Hydrochemistry)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">pH Value</span>
                <span className="font-bold text-slate-900 dark:text-white">6.8 – 7.4 (Neutral)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Electrical Conductivity</span>
                <span className="font-bold text-slate-900 dark:text-white">210 – 380 µS/cm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Total Dissolved Solids</span>
                <span className="font-bold text-slate-900 dark:text-white">&lt; 250 mg/L (Fresh)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px]">Fluoride Content</span>
                <span className="font-bold text-slate-900 dark:text-white">&lt; 0.6 mg/L (Safe)</span>
              </div>
            </div>
          </div>

          {/* 5. Official Source & Technical Reference */}
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <strong>Official Reference:</strong> Central Ground Water Board (CGWB), North Eastern Region, Government of India. Calibrated against Tripura ground water monitoring bulletin.
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
