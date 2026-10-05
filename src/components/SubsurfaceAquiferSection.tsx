import React, { useState } from 'react';
import { ArrowDown, Layers, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface SubsurfaceAquiferSectionProps {
  station: HydroStation;
}

export const SubsurfaceAquiferSection: React.FC<SubsurfaceAquiferSectionProps> = ({ station }) => {
  const [activeLayerId, setActiveLayerId] = useState<'topsoil' | 'vadose' | 'watertable' | 'saturated' | 'deep'>('watertable');
  const wellDepth = calculateWellDepth(station.pre_depth);

  const STRATA_DATA = [
    {
      id: 'topsoil' as const,
      depthRange: '0.0 – 2.0 m',
      name: 'Ground Surface & Topsoil',
      subname: 'Recent Alluvial Silt & Humic Loam',
      desc: 'Upper humic soil horizon of the Tripura river basins. Highly porous, absorbs rainfall, but subject to surface microbial runoff. Requires 3m solid cement grout seal.',
      permeability: 'Medium (10⁻⁴ m/s)',
      casingRole: 'Surface sanitary casing seal (minimum 3 m) to prevent contaminated stormwater infiltration.',
      textureImg: IMAGES.realEarthSoil,
      strataColor: 'from-amber-950/80 via-stone-900/90 to-stone-900/95',
      badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    },
    {
      id: 'vadose' as const,
      depthRange: `2.0 – ${station.pre_depth.toFixed(1)} m`,
      name: 'Vadose (Unsaturated) Zone',
      subname: 'Micaceous Fine Sand & Weathered Siltstone',
      desc: 'Pores contain air and percolating gravitational rainwater. Dry season creates water deficit; pore spaces do not yield free-flowing water to pumps.',
      permeability: 'Moderate (10⁻³ m/s)',
      casingRole: 'Solid 150 mm uPVC or MS borehole casing pipe preventing wall collapse in loose sands.',
      textureImg: IMAGES.sedimentStrata,
      strataColor: 'from-stone-900/85 via-stone-950/90 to-stone-950/95',
      badgeColor: 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700',
    },
    {
      id: 'watertable' as const,
      depthRange: `${station.pre_depth.toFixed(2)} m mbgl`,
      name: 'Static Water Table (Phreatic Surface)',
      subname: 'Boundary of 100% Water Saturation',
      desc: `Exact pre-monsoon static water level observed at ${station.location}. Below this horizon, all pore spaces in the rock matrix are completely saturated with pressurized groundwater.`,
      permeability: 'Direct Telemetry Horizon',
      casingRole: 'Pump intake suction level; must remain submerged 2.5m below seasonal drawdown limit.',
      textureImg: IMAGES.cleanAquiferWater,
      strataColor: 'from-sky-950/90 via-cyan-950/95 to-slate-950',
      badgeColor: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-700',
    },
    {
      id: 'saturated' as const,
      depthRange: `${station.pre_depth.toFixed(1)} – ${wellDepth.toFixed(1)} m`,
      name: 'Saturated Aquifer & Well Screen',
      subname: `${station.terrain} Saturated Sandstone`,
      desc: `Primary drinking water supply zone. Porous coarse sandstone transmits clean, potable water freely. Recommended well strainer depth is ${wellDepth.toFixed(1)} m.`,
      permeability: 'High (10⁻² m/s) • Specific Yield 14-18%',
      casingRole: 'Continuous slot stainless/uPVC screen (0.50 mm) surrounded by graded pea gravel pack (2.0 - 3.5 mm).',
      textureImg: IMAGES.pureAquiferWater,
      strataColor: 'from-cyan-950/90 via-sky-950/95 to-slate-950',
      badgeColor: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
    },
    {
      id: 'deep' as const,
      depthRange: `${(station.pre_depth + 25).toFixed(0)} – 110 m`,
      name: 'Deep Confined Aquifer Horizon',
      subname: 'Tipam / Surma Consolidated Quartz Sandstone',
      desc: 'Protected deep water reservoir beneath impermeable claystone. Immune to seasonal dry-period drought; ideal for high-capacity community and irrigation wells.',
      permeability: 'High Storage Yield • Semi-Artesian Pressure',
      casingRole: 'Deep tube well target for drought resilience and high municipal discharge.',
      textureImg: IMAGES.underwaterAquiferDeep,
      strataColor: 'from-blue-950/90 via-slate-950/95 to-slate-950',
      badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
    },
  ];

  const currentLayer = STRATA_DATA.find((l) => l.id === activeLayerId) || STRATA_DATA[2];

  return (
    <section id="section-subsurface" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* 1. Dramatic Underground Transition Banner */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl border border-sky-400/20 bg-slate-950">
        {/* Background cross-section photographic texture */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <img
            src={IMAGES.sedimentStrata}
            alt="Real sediment strata texture"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        {/* Transition Header Content */}
        <div className="relative z-10 p-8 sm:p-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <WaterDropIcon className="w-3.5 h-3.5" />
            <span>Subsurface Geological Horizon</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            See Where the Water Begins.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            A continuous physical cross-section of the earth beneath <strong className="text-white">{station.location}</strong> ({station.district} District), translating telemetry into physical depth horizons.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Static Water Level: <strong>{station.pre_depth.toFixed(2)} mbgl</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Recommended Well Depth: <strong>{wellDepth.toFixed(2)} m</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Formation: <strong>{station.terrain}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Realistic Underground Cutaway with Physical Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Center Column (8 cols): The Physical Underground Cross-Section */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-sky-400/20 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Visual Header */}
          <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-white tracking-wide uppercase">Authentic Geological Column</span>
            </div>
            <span className="text-slate-400">Click any layer to inspect hydraulic properties</span>
          </div>

          {/* Cross Section Body */}
          <div className="p-4 sm:p-6 space-y-3">
            {STRATA_DATA.map((layer, index) => {
              const isSelected = activeLayerId === layer.id;
              const isWaterTable = layer.id === 'watertable';
              const isSaturated = layer.id === 'saturated';

              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)] scale-[1.01]'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
                  }`}
                >
                  {/* Layer Background Realistic Photographic Texture */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img
                      src={layer.textureImg}
                      alt={layer.name}
                      className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${layer.strataColor}`} />
                  </div>

                  {/* Layer Content */}
                  <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Depth Ruler & Horizon Details */}
                    <div className="flex items-start gap-3.5">
                      {/* Depth Marker Badge */}
                      <div className="flex flex-col items-center justify-center min-w-[70px] px-2.5 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-center shrink-0">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Depth</span>
                        <span className="text-xs font-bold text-white font-mono">{layer.depthRange}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                            {layer.name}
                          </h4>
                          {isWaterTable && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white animate-pulse">
                              <WaterDropIcon className="w-3 h-3" /> Live Water Table
                            </span>
                          )}
                          {isSaturated && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-600 text-white">
                              Productive Aquifer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 font-medium">
                          {layer.subname}
                        </p>
                      </div>
                    </div>

                    {/* Right: Technical tag & chevron */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-slate-200">
                        {layer.permeability}
                      </span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${isSelected ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-400 group-hover:text-white'}`}>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Physical Connected Indicator Line for Water Table */}
                  {isWaterTable && (
                    <div className="relative z-10 border-t border-sky-400/80 bg-sky-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-sky-200 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                        <span>Phreatic Water Surface Meniscus at {station.pre_depth.toFixed(2)} m</span>
                      </div>
                      <span className="font-mono text-[11px] text-white">100% Water Saturated Below This Line ↓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Depth Reference */}
          <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Topsoil (0-2m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" /> Vadose Sand
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Water Table ({station.pre_depth.toFixed(2)}m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Aquifer Well Screen ({wellDepth.toFixed(1)}m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Deep Horizon (60-110m)
            </span>
          </div>
        </div>

        {/* Right Column (4 cols): Active Strata Hydraulic & Casing Properties */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                Geological Profile Detail
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${currentLayer.badgeColor}`}>
                {currentLayer.depthRange}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {currentLayer.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {currentLayer.subname}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentLayer.desc}
            </div>

            {/* Casing & Drilling Role Specification */}
            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <div className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Borehole Casing Specification</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {currentLayer.casingRole}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Hydraulic Conductivity
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {currentLayer.permeability}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Lithology mapped from Central Ground Water Board (NER) records</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
