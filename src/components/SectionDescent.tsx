import React from 'react';
import { Layers, ArrowDown, Droplets, Gauge, Shield, AlertTriangle } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';

interface SectionDescentProps {
  selectedStation: HydroStation;
}

export const SectionDescent: React.FC<SectionDescentProps> = ({ selectedStation }) => {
  const { formatNum } = useLanguage();

  const waterLevel = selectedStation.pre_depth;
  const wellDepth = calculateWellDepth(waterLevel);
  const targetDeepMin = selectedStation.type === 'PZ'
    ? Math.max(70, Math.round(waterLevel * 4))
    : Math.max(35, Math.round(waterLevel * 5));
  const targetDeepMax = targetDeepMin + (selectedStation.type === 'PZ' ? 45 : 30);

  const STRATA_LAYERS = [
    {
      depth: '0.0 m',
      label: 'Ground Surface Horizon',
      sublabel: 'Recent Fluvial Alluvium & Topsoil',
      color: 'border-amber-700/50 bg-amber-950/20 text-amber-300',
      description: 'Humic organic loam and weathered silts forming the upper boundary of the Tripura floodplains.',
      thickness: '0.0 – 1.8 mbgl',
    },
    {
      depth: '2.5 m',
      label: 'Vadose / Unsaturated Zone',
      sublabel: 'Unconsolidated Sandy Silt & Micaceous Sand',
      color: 'border-yellow-700/40 bg-yellow-950/20 text-yellow-300',
      description: 'Pores filled with air and downward percolating gravitational rainwater. High vertical permeability.',
      thickness: '1.8 – 4.0 mbgl',
    },
    {
      depth: `${waterLevel} m`,
      label: 'Capillary Fringe & Static Water Table',
      sublabel: 'Phreatic Surface Meniscus',
      highlight: true,
      color: 'border-cyan-400 bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-400/30',
      description: `Observed pre-monsoon static water level at ${selectedStation.location}. Pores are 100% water saturated below this horizon.`,
      thickness: `Exact Telemetry: ${waterLevel} mbgl`,
    },
    {
      depth: `${wellDepth} m`,
      label: 'Saturated Aquifer Horizon',
      sublabel: 'Tipam Series Porous Sandstone',
      highlight: true,
      color: 'border-sky-400/80 bg-sky-950/30 text-sky-200',
      description: `Calculated target well depth [${waterLevel}m WL + 3.5m screen + 0.8m sump]. Coarse granular sands yielding high domestic discharge.`,
      thickness: `Screen Depth: ${wellDepth} m`,
    },
    {
      depth: `${targetDeepMin} – ${targetDeepMax} m`,
      label: 'Deep Confined Aquifer Horizon',
      sublabel: 'Surma / Lower Tipam Semi-Consolidated Sandstones',
      color: 'border-blue-500/60 bg-blue-950/30 text-blue-300',
      description: 'Deep artesian and semi-confined reservoirs isolated from surface contaminants and drought fluctuations by impermeable clays.',
      thickness: `Target Drilling Horizon`,
    },
    {
      depth: '> 120 m',
      label: 'Impervious Bedrock & Shale Aquitard',
      sublabel: 'Bhuban Formation Compacted Siltstone & Shale',
      color: 'border-indigo-600/40 bg-indigo-950/20 text-indigo-300',
      description: 'Dense synclinal basement rocks acting as the regional hydrological floor for Tripura valley basins.',
      thickness: 'Regional Geological Base',
    },
  ];

  return (
    <section
      id="section-descent"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="max-w-3xl mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>PHASE II • THE SUBTERRANEAN DESCENT</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Travelling Through Earth’s Strata
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          As you descend beneath {selectedStation.location}, observe the real measured stratigraphic horizons calculated directly from CGWB telemetry station #{selectedStation.id}.
        </p>
      </div>

      {/* Interactive Stratigraphy Ruler & Layer Showcase */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Scientific Depth Scale / Vertical Hydro-Ruler */}
        <div className="lg:col-span-3 sticky top-24 space-y-4 p-4 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/20">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-500/20 pb-2">
            <span>DEPTH RULER (mbgl)</span>
            <span>STATION #{selectedStation.id}</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-amber-300">
              <span>0.0 m</span>
              <span className="text-[10px] text-slate-400">SURFACE</span>
            </div>
            <div className="h-4 border-l-2 border-dashed border-amber-700/40 ml-2" />
            <div className="flex items-center justify-between text-yellow-300">
              <span>2.5 m</span>
              <span className="text-[10px] text-slate-400">VADOSE</span>
            </div>
            <div className="h-4 border-l-2 border-dashed border-cyan-500/50 ml-2" />
            <div className="flex items-center justify-between text-cyan-300 font-bold bg-cyan-950/50 p-1 rounded">
              <span>{waterLevel} m</span>
              <span className="text-[10px] text-cyan-400">WATER TABLE</span>
            </div>
            <div className="h-4 border-l-2 border-dashed border-sky-400/60 ml-2" />
            <div className="flex items-center justify-between text-sky-200 font-bold bg-sky-950/50 p-1 rounded">
              <span>{wellDepth} m</span>
              <span className="text-[10px] text-sky-400">WELL DEPTH</span>
            </div>
            <div className="h-6 border-l-2 border-dashed border-blue-600/40 ml-2" />
            <div className="flex items-center justify-between text-blue-300">
              <span>{targetDeepMin}m – {targetDeepMax}m</span>
              <span className="text-[10px] text-slate-400">DEEP SAND</span>
            </div>
            <div className="h-6 border-l-2 border-dashed border-indigo-700/40 ml-2" />
            <div className="flex items-center justify-between text-indigo-400">
              <span>&gt; 120 m</span>
              <span className="text-[10px] text-slate-400">BEDROCK</span>
            </div>
          </div>

          <div className="pt-3 border-t border-cyan-500/20 text-[11px] text-slate-400 font-mono space-y-1">
            <div>Terrain: {selectedStation.terrain}</div>
            <div>Coordinates: {selectedStation.lat.toFixed(3)}°N, {selectedStation.lng.toFixed(3)}°E</div>
          </div>
        </div>

        {/* Right Side: Stratigraphic Cards linked to 3D Descent */}
        <div className="lg:col-span-9 space-y-4">
          {STRATA_LAYERS.map((stratum, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${stratum.color} ${
                stratum.highlight ? 'shadow-[0_0_30px_rgba(6,182,212,0.2)]' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 font-mono text-xs font-bold">
                    {stratum.depth}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {stratum.label}
                  </h3>
                </div>
                <span className="text-xs font-mono text-cyan-200/80">
                  {stratum.thickness}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-300/80 mb-2">
                {stratum.sublabel}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {stratum.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
