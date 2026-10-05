import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, ShieldCheck, Droplet, ArrowDown } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface SectionGroundwaterProfileProps {
  station: HydroStation;
}

export const SectionGroundwaterProfile: React.FC<SectionGroundwaterProfileProps> = ({ station }) => {
  const [showSubsurfaceDetails, setShowSubsurfaceDetails] = useState(false);
  const wellDepth = calculateWellDepth(station.pre_depth);
  const riskInfo = getStationRiskCategory(station.risk);

  // Normalization for visual column (0 to max 25m scale)
  const maxDepth = Math.max(18, wellDepth * 1.35);
  const waterTablePct = Math.min(85, Math.max(15, (station.pre_depth / maxDepth) * 100));
  const wellDepthPct = Math.min(95, Math.max(35, (wellDepth / maxDepth) * 100));

  return (
    <section id="section-profile" className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* 1. Realistic Earth & Aquifer Water Photographic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Upper soil layer */}
        <div className="absolute top-0 left-0 right-0 h-[48%] overflow-hidden">
          <img
            src={IMAGES.realEarthSoil}
            alt="Soil and alluvial earth layer"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1]"
          />
        </div>
        {/* Lower pure water aquifer */}
        <div className="absolute top-[45%] left-0 right-0 bottom-0 overflow-hidden">
          <img
            src={IMAGES.pureAquiferWater}
            alt="Pristine clear aquifer groundwater"
            className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.1]"
          />
        </div>
        {/* Soft dark blend overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/85 backdrop-blur-[1px]" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sky-200 text-xs font-semibold mb-4">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Subsurface Hydrogeological Profile</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
          Groundwater Strata Profile
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto font-normal">
          Vertical cross-section of the water table and aquifer horizon at {station.location}.
        </p>

        {/* 3. The One Elegant Subsurface Visualization Diagram */}
        <div className="mt-12 rounded-3xl bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-left">
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/20 bg-slate-950/60 flex flex-col justify-between p-4 sm:p-6 select-none">
            {/* Strata Background Textures */}
            {/* Top: Unsaturated Earth Layer */}
            <div
              className="absolute top-0 left-0 right-0 transition-all duration-700 bg-gradient-to-b from-amber-950/40 to-stone-900/50 border-b-2 border-dashed border-sky-400"
              style={{ height: `${waterTablePct}%` }}
            >
              <div className="absolute top-3 left-4 text-xs font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>Ground Surface (0.00 m) — Topsoil &amp; Silt</span>
              </div>
            </div>

            {/* Middle: Saturated Aquifer Zone */}
            <div
              className="absolute left-0 right-0 bottom-0 transition-all duration-700 bg-gradient-to-b from-sky-600/30 via-sky-500/20 to-sky-900/50"
              style={{ top: `${waterTablePct}%` }}
            >
              {/* Dynamic Water Table Line Marker */}
              <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-4 py-1 bg-sky-500/80 backdrop-blur-xs text-white text-xs font-bold shadow-md">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  <span>WATER TABLE (Phreatic Level): {station.pre_depth.toFixed(2)} m</span>
                </span>
                <span className="text-[11px] font-mono text-sky-100">mbgl</span>
              </div>

              {/* Saturated Aquifer Label */}
              <div className="absolute top-1/3 left-4 text-xs font-bold text-sky-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-ping" />
                <span>Productive Aquifer — {station.terrain} Sandstone</span>
              </div>
            </div>

            {/* Vertical Borehole Shaft Simulation */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-8 sm:w-10 z-10 flex flex-col items-center">
              {/* Casing Tube */}
              <div
                className="w-4 sm:w-5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 border border-slate-700 rounded-b shadow-lg"
                style={{ height: `${wellDepthPct * 3.2}px` }}
              >
                {/* Well Depth Bottom Marker */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold whitespace-nowrap shadow-md">
                  Well Depth: {wellDepth.toFixed(2)} m
                </div>
              </div>
            </div>

            {/* Bottom Scale Label */}
            <div className="relative z-20 mt-auto flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
              <span>Station: <strong>{station.location}</strong></span>
              <span className="font-mono">Maximum Logged Horizon: {maxDepth.toFixed(1)} m</span>
            </div>
          </div>

          {/* Metrics Below Visualization */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center sm:text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Water Level</span>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {station.pre_depth.toFixed(2)} <span className="text-sm font-normal text-slate-300">m</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Recommended Well Depth</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {wellDepth.toFixed(2)} <span className="text-sm font-normal text-slate-300">m</span>
              </div>
            </div>
          </div>

          {/* Button: Explore Subsurface Details */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowSubsurfaceDetails(!showSubsurfaceDetails)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{showSubsurfaceDetails ? 'Hide Subsurface Details' : 'Explore Subsurface Details'}</span>
              {showSubsurfaceDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Subsurface Geological Information */}
          {showSubsurfaceDetails && (
            <div className="mt-6 pt-6 border-t border-white/15 space-y-4 text-sm text-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                  <h4 className="font-bold text-sky-400 mb-1">Lithological Composition</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    0.0 – 2.5 m: Brownish grey silty clay / sandy loam.<br />
                    2.5 – 6.0 m: Fine to medium grained yellow weathered sandstone.<br />
                    &gt; 6.0 m: Greyish compact micaceous sandstone with productive intergranular porosity.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                  <h4 className="font-bold text-emerald-400 mb-1">Hydraulic Characteristics</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hydraulic Conductivity: <strong>8.5 to 14.2 m/day</strong><br />
                    Transmissivity (T): <strong>120 to 240 m²/day</strong><br />
                    Safe Yield: <strong>15 to 30 m³/hour</strong> for domestic and small irrigation installations.
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
