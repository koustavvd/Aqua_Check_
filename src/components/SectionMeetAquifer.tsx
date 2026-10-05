import React from 'react';
import { Droplets, Compass, Waves, ArrowRight, Gauge } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';

interface SectionMeetAquiferProps {
  selectedStation: HydroStation;
  onContinueToStations: () => void;
}

export const SectionMeetAquifer: React.FC<SectionMeetAquiferProps> = ({
  selectedStation,
  onContinueToStations,
}) => {
  const { formatNum } = useLanguage();
  const waterLevel = selectedStation.pre_depth;
  const wellDepth = calculateWellDepth(waterLevel);

  return (
    <section
      id="section-aquifer"
      className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Centered Cinematic Pause Statement */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Waves className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>PHASE III • SUBTERRANEAN FLUID DYNAMICS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight">
          "The water below is <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
            not static.
          </span>"
        </h2>

        <p className="text-sm sm:text-lg text-cyan-100/80 font-light max-w-2xl mx-auto leading-relaxed">
          Porous granular sandstones throughout {selectedStation.district} form dynamic subterranean streams under continuous pressure, recharging during monsoons and migrating along synclinal gradients.
        </p>
      </div>

      {/* Floating Holographic / Scientific Instrument Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full mb-12">
        {/* Instrument Panel 1: Water Level */}
        <div className="relative group p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300/80 mb-3">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400 animate-bounce" />
              TELEMETRY PARAMETER
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
              WL • STATIC
            </span>
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
            WATER LEVEL
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white my-2 tracking-tight">
            {waterLevel} <span className="text-lg font-light text-cyan-300">mbgl</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Pre-monsoon static head at {selectedStation.location}.
            {selectedStation.trend_fall > 0 ? (
              <span className="text-amber-400 block mt-1">
                Seasonal decline: -{selectedStation.trend_fall} m/yr
              </span>
            ) : (
              <span className="text-emerald-400 block mt-1">
                Monsoon recovery: +{selectedStation.trend_rise} m/yr
              </span>
            )}
          </p>
        </div>

        {/* Instrument Panel 2: Calculated Well Depth */}
        <div className="relative group p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-sky-500/30 hover:border-sky-400/80 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-mono text-sky-300/80 mb-3">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-400" />
              ENGINEERING DIRECTIVE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30">
              WL + 3.5m + 0.8m
            </span>
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
            WELL DEPTH
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white my-2 tracking-tight">
            {wellDepth} <span className="text-lg font-light text-sky-300">meters</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Includes 3.5m precision slotted strainer interval and 0.8m bottom sediment sump.
          </p>
        </div>

        {/* Instrument Panel 3: Aquifer Horizon */}
        <div className="relative group p-6 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-teal-500/30 hover:border-teal-400/80 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-mono text-teal-300/80 mb-3">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-400" />
              LITHOLOGICAL MATRIX
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30">
              TERRAIN
            </span>
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
            AQUIFER HORIZON
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white my-2 tracking-tight line-clamp-2">
            {selectedStation.terrain}
          </div>
          <p className="text-xs text-slate-300 font-mono">
            {selectedStation.note}
          </p>
        </div>
      </div>

      {/* Continuation CTA to Spatial Network */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onContinueToStations}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <span>MAP THE MONITORING STATIONS</span>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
