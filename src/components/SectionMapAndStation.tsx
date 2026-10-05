import React from 'react';
import { Layers, Compass, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { HydroMap } from './HydroMap';
import { WaterDropIcon } from './WaterDropIcon';

interface SectionMapAndStationProps {
  stations: HydroStation[];
  selectedStation: HydroStation | null;
  onSelectStation: (station: HydroStation) => void;
  droppedPin: { lat: number; lng: number } | null;
  onDropPin: (coords: { lat: number; lng: number }) => void;
  selectedDistrict: string;
  onViewFullStationDetails: () => void;
}

export const SectionMapAndStation: React.FC<SectionMapAndStationProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  droppedPin,
  onDropPin,
  selectedDistrict,
  onViewFullStationDetails,
}) => {
  const riskInfo = selectedStation ? getStationRiskCategory(selectedStation.risk) : null;
  const wellDepth = selectedStation ? calculateWellDepth(selectedStation.pre_depth) : null;

  return (
    <section id="section-map" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Subtle Environmental Water Background Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_70%)] blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 backdrop-blur-md">
          <WaterDropIcon className="w-3.5 h-3.5" />
          <span>Geographic Monitoring Network</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tripura Observation Network
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
          Click any water-drop observation well on the map to inspect groundwater telemetry.
        </p>
      </div>

      {/* Main Composition: 70% Map, 30% Station Information */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 70% (8 cols on lg): The Geographic Map */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 min-h-[500px] sm:min-h-[560px] flex flex-col">
          {/* Map Top Bar */}
          <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-white">CGWB Hydrological Stations ({stations.length})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low Risk
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> High
              </span>
            </div>
          </div>

          {/* Leaflet Interactive Map */}
          <div className="relative flex-1 w-full min-h-[440px]">
            <HydroMap
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={onSelectStation}
              droppedPin={droppedPin}
              onDropPin={onDropPin}
              selectedDistrict={selectedDistrict}
            />
          </div>
        </div>

        {/* Right 30% (4 cols on lg): Station Information Panel */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl p-6 sm:p-7 flex flex-col justify-between">
          {!selectedStation ? (
            /* State A: No Station Selected */
            <div className="h-full flex flex-col items-center justify-center text-center py-10 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-500 flex items-center justify-center mb-4 shadow-inner">
                <WaterDropIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Select a Monitoring Station
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Click any water-drop marker on the map to view real groundwater conditions and depth metrics.
              </p>
            </div>
          ) : (
            /* State B: Selected Station — ONLY 5 key items as requested */
            <div className="h-full flex flex-col justify-between">
              <div>
                {/* 1. Header with Station Type & PIN */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    <WaterDropIcon className="w-3.5 h-3.5" />
                    <span>Station #{selectedStation.id}</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    PIN {selectedStation.pincode}
                  </span>
                </div>

                {/* 2. Station Name & Location */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedStation.location}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedStation.village}, {selectedStation.district} District</span>
                </p>

                {/* 3. The 3 Primary Metrics: Water Level, Well Depth, Vulnerability */}
                <div className="mt-6 space-y-4">
                  {/* Water Level */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                        Water Level
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Static depth below surface
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedStation.pre_depth.toFixed(2)}
                      <span className="text-sm font-normal text-slate-500 ml-1">m</span>
                    </div>
                  </div>

                  {/* Well Depth */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        Well Depth
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Recommended shallow depth
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {wellDepth?.toFixed(2)}
                      <span className="text-sm font-normal text-slate-500 ml-1">m</span>
                    </div>
                  </div>

                  {/* Vulnerability Score */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Vulnerability
                      </span>
                      <div className={`text-xs font-semibold mt-0.5 ${riskInfo?.text}`}>
                        {riskInfo?.label} Risk Profile
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {riskInfo?.score}
                      <span className="text-sm font-normal text-slate-400 ml-1">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Action: View Full Station Details Button */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={onViewFullStationDetails}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group"
                >
                  <span>View Full Station Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
