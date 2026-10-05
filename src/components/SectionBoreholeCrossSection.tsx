import React, { useState, useRef, useEffect } from 'react';
import { Layers, RotateCcw, ZoomIn, ZoomOut, CheckCircle, Info, Sparkles } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth } from '../data/tripuraData';

interface SectionBoreholeCrossSectionProps {
  station: HydroStation;
}

export const SectionBoreholeCrossSection: React.FC<SectionBoreholeCrossSectionProps> = ({ station }) => {
  const [rotationAngle, setRotationAngle] = useState(15);
  const [isRotating, setIsRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const lastMouseX = useRef(0);

  const waterLevel = station.pre_depth;
  const wellDepth = calculateWellDepth(waterLevel);
  const screenTop = waterLevel;
  const screenBottom = Number((waterLevel + 3.5).toFixed(2));
  const sumpBottom = wellDepth;

  // Interactive 3D mouse rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(true);
    lastMouseX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRotating) return;
    const deltaX = e.clientX - lastMouseX.current;
    setRotationAngle((prev) => prev + deltaX * 0.4);
    lastMouseX.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsRotating(false);
  };

  return (
    <section
      id="section-geological-section"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="max-w-2xl mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>PHASE VI • SUBSURFACE BOREHOLE CROSS-SECTION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Geological Cross-Section & Well Architecture
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Interactive 3D subsurface borehole model illustrating geological strata, phreatic water horizon, casing pipes, and precision slotted strainers at {station.location}.
        </p>
      </div>

      {/* Main Interactive Subsurface Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive 3D Borehole Section Diagram */}
        <div
          className="lg:col-span-8 relative p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRotationAngle(0)}
              title="Reset View"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/10 text-xs font-mono transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              title="Zoom In"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/10 text-xs font-mono transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              title="Zoom Out"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/10 text-xs font-mono transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute top-4 left-4 z-20 text-[11px] font-mono text-cyan-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            Click & Drag horizontally to rotate perspective
          </div>

          {/* 3D Isometric / Orthographic Borehole Canvas */}
          <div
            className="w-full h-[520px] flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${rotationAngle}deg) scale(${zoomLevel})`,
            }}
          >
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              {/* Vertical Subsurface Strata Columns */}
              <div className="relative w-72 h-[460px] rounded-xl overflow-hidden border border-cyan-400/40 shadow-inner flex flex-col justify-between">
                {/* Stratum 1: Ground Surface & Top Soil (0.0 to 1.8m) */}
                <div className="relative h-[18%] bg-gradient-to-b from-[#3a271d] to-[#4e3526] border-b border-amber-600/40 p-2 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-amber-200 uppercase font-bold">
                    Top Soil & Silty Alluvium
                  </div>
                  <span className="text-[9px] font-mono text-amber-300/80">0.0 – 1.8 m</span>
                </div>

                {/* Stratum 2: Vadose Unsaturated Zone (1.8 to Water Level) */}
                <div className="relative h-[26%] bg-gradient-to-b from-[#4e3526] to-[#2d1e16] border-b border-cyan-400 p-2 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-yellow-200 uppercase font-bold">
                    Vadose Zone (Micaceous Sand)
                  </div>
                  <span className="text-[9px] font-mono text-yellow-300/80">1.8 – {waterLevel} m</span>
                </div>

                {/* Stratum 3: Water Table Line (Luminous Cyan Horizon) */}
                <div className="absolute top-[44%] inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] z-10 flex items-center justify-between px-2 pointer-events-none">
                  <span className="text-[9px] font-mono font-bold text-cyan-300 bg-slate-950 px-1 rounded -translate-y-3">
                    ▼ WATER TABLE: {waterLevel} mbgl
                  </span>
                </div>

                {/* Stratum 4: Saturated Aquifer Horizon (Water Level to Well Depth) */}
                <div className="relative h-[36%] bg-gradient-to-b from-[#0e3b52] via-[#094766] to-[#062c3e] border-b border-blue-500/40 p-2 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-cyan-200 uppercase font-bold">
                    Saturated Sandstone Aquifer
                  </div>
                  <span className="text-[9px] font-mono text-cyan-300/80">{waterLevel} – {screenBottom} m</span>
                </div>

                {/* Stratum 5: Impervious Bedrock / Sump Zone */}
                <div className="relative h-[20%] bg-gradient-to-b from-[#062c3e] to-[#02141f] p-2 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-indigo-200 uppercase font-bold">
                    Confining Shale & Sump
                  </div>
                  <span className="text-[9px] font-mono text-indigo-300/80">{sumpBottom} m</span>
                </div>

                {/* Central Casing Pipe + Slotted Screen + Sump Graphic */}
                <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-9 rounded-md border border-cyan-300/80 bg-slate-900/90 shadow-2xl flex flex-col justify-between overflow-hidden z-10">
                  {/* Solid Casing Pipe (0m to Water Level) */}
                  <div className="h-[44%] bg-slate-800 border-b border-cyan-400 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-300 -rotate-90 whitespace-nowrap">
                      CASING 150mm
                    </span>
                  </div>

                  {/* Slotted Strainer Screen Interval (3.5m length) */}
                  <div className="h-[36%] bg-cyan-950/90 border-b border-cyan-400 flex flex-col justify-around py-1 px-1 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 to-transparent animate-pulse" />
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-0.5 w-full bg-cyan-400/80 rounded" />
                    ))}
                    <span className="text-[8px] font-mono text-cyan-200 -rotate-90 whitespace-nowrap text-center z-10">
                      SCREEN 3.5m
                    </span>
                  </div>

                  {/* Bottom Sediment Sump (0.8m length) */}
                  <div className="h-[20%] bg-slate-800 flex items-center justify-center">
                    <span className="text-[7px] font-mono text-slate-300 -rotate-90 whitespace-nowrap">
                      SUMP 0.8m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Scientific Construction Directives & Dimensions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Borehole Specifications
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">1. SOLID CASING DEPTH</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  0.0 m to {waterLevel} m (mbgl)
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  150mm / 200mm ISI PVC pipe passing through dry vadose zone.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="text-cyan-400 text-[10px] uppercase">2. PRECISION SLOTTED SCREEN</div>
                <div className="text-cyan-200 font-bold text-sm mt-0.5">
                  {waterLevel} m to {screenBottom} m (3.5m length)
                </div>
                <div className="text-cyan-300/80 text-[11px] mt-0.5">
                  0.5mm – 0.75mm slot size placed across granular sandstone layer.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">3. BOTTOM SEDIMENT SUMP</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  {screenBottom} m to {sumpBottom} m (0.8m length)
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Collects dislodged sand fines; total well depth = {wellDepth} m.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">4. ANNULAR GRAVEL PACKING</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  2.0mm – 3.5mm Pea Gravel
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Continuous pack up to 6 meters above the top screen to prevent silt clogging.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
