import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Layers, Wrench, FlaskConical, MapPin, Search, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateDistanceKm, getStationRiskCategory, calculateWellDepth } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';

interface TechnicalDetailsSectionProps {
  station: HydroStation;
  allStations: HydroStation[];
  onSelectStation: (st: HydroStation) => void;
}

export const TechnicalDetailsSection: React.FC<TechnicalDetailsSectionProps> = ({
  station,
  allStations,
  onSelectStation,
}) => {
  // Accordion toggle states
  const [openAccordion, setOpenAccordion] = useState<'geo' | 'drill' | 'chem' | 'nearby' | null>(null);

  // Search and pagination state for all stations modal/table
  const [allStationsOpen, setAllStationsOpen] = useState(false);
  const [stationFilter, setStationFilter] = useState('');

  const toggleSection = (section: 'geo' | 'drill' | 'chem' | 'nearby') => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  // Find 4 nearest stations
  const nearbyStations = useMemo(() => {
    return allStations
      .filter((s) => s.id !== station.id)
      .map((s) => ({
        ...s,
        distance: calculateDistanceKm(station.lat, station.lng, s.lat, s.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
  }, [allStations, station]);

  // Filtered all stations for directory view
  const filteredAllStations = useMemo(() => {
    const q = stationFilter.trim().toLowerCase();
    if (!q) return allStations;
    return allStations.filter(
      (s) =>
        s.location.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.pincode.includes(q) ||
        s.block.toLowerCase().includes(q)
    );
  }, [allStations, stationFilter]);

  return (
    <section id="section-technical-details" className="relative py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Technical Specifications &amp; Hydrogeology
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Expandable technical engineering references, laboratory hydrochemistry, and regional station correlation.
        </p>
      </div>

      {/* 4 Clean Accordion Cards */}
      <div className="max-w-4xl mx-auto space-y-3.5">
        {/* Accordion 1: Geological Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('geo')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  View Geological Details
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Regional stratigraphy, lithology, and hydrogeological formation properties
                </div>
              </div>
            </div>
            {openAccordion === 'geo' ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openAccordion === 'geo' && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Local Formation</div>
                  <div className="text-sky-700 dark:text-sky-400 font-semibold">{station.terrain}</div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Characterized by sub-Himalayan folded Tertiary sedimentary rocks arranged in north-south trending anticlines and synclinal alluvial valleys.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Aquifer Facies &amp; Storage</div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Unconfined to Semi-Confined</div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Specific yield ranges from 12% to 18% in coarse river valley sands, reducing to 3% to 6% in compacted siltstone interbeds.
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                Field Hydrogeological Note: "{station.note}"
              </p>
            </div>
          )}
        </div>

        {/* Accordion 2: Drilling Specifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('drill')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  View Drilling Specifications
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Casing pipe dimensions, continuous slot screen sizes, and well development
                </div>
              </div>
            </div>
            {openAccordion === 'drill' ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openAccordion === 'drill' && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Borehole Dia</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">200 - 250 mm</span>
                  <span className="text-[10px] text-slate-500 block">8" to 10" pilot hole</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Casing Pipe</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">150 mm (6")</span>
                  <span className="text-[10px] text-slate-500 block">uPVC Class 9 / IS:12818</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Screen Slot</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">0.50 - 0.75 mm</span>
                  <span className="text-[10px] text-slate-500 block">Continuous V-wire slot</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gravel Pack</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">2.0 - 3.5 mm</span>
                  <span className="text-[10px] text-slate-500 block">Washed silica pea gravel</span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mandatory Well Development Directive:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Surge well with high-capacity air compressor (100–150 psi) for a minimum of 8 to 12 continuous hours until effluent water is 100% sand-free and clear. Never hand over an undeveloped tube well to prevent pump impeller abrasion.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Hydrochemistry */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('chem')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  View Hydrochemistry &amp; Water Quality
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Dissolved iron (Fe), micaceous turbidity, and low-cost filtration treatment
                </div>
              </div>
            </div>
            {openAccordion === 'chem' ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openAccordion === 'chem' && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 space-y-4">
              {/* Laboratory Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                      Dissolved Iron (Fe)
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                      Elevated
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    &gt; 1.0 mg/L
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    BIS 10500 limit: 0.3 mg/L
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                      Turbidity
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Moderate
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    2.5 - 6.0 NTU
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Micaceous silt suspension
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                      Arsenic &amp; Fluoride
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                      Safe
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Within Safe Limits
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    As &lt;0.01 mg/L • F &lt;1.0 mg/L
                  </div>
                </div>
              </div>

              {/* What It Means & How to Treat It */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    What It Means
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Underground water is anaerobic, keeping iron dissolved as clear ferrous ions (Fe²⁺). Once pumped to the surface, atmospheric oxygen oxidizes it into insoluble reddish-brown ferric hydroxide (Fe³⁺) flakes, staining laundry and fixtures.
                  </p>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    How To Treat It
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Install a simple gravity aeration tray cascade to aerate the water, followed by a dual-media gravity filter containing 30cm of graded quartz sand (0.5–1.0 mm) over 15cm of pea gravel. This removes 95%+ of precipitate without electricity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 4: Nearby Stations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('nearby')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  View Nearby Monitoring Stations
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Adjacent CGWB wells within regional radius &amp; full 118 station directory
                </div>
              </div>
            </div>
            {openAccordion === 'nearby' ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openAccordion === 'nearby' && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 space-y-4">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Closest 4 Monitoring Wells to {station.location}:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyStations.map((nst) => {
                  const nRisk = getStationRiskCategory(nst.risk);
                  return (
                    <div
                      key={nst.id}
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-sky-300 dark:hover:border-sky-700 transition group"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition">
                          {nst.location}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {nst.district} • {nst.distance} km away
                        </div>
                        <div className="text-[11px] font-medium text-sky-700 dark:text-sky-300 mt-0.5">
                          Water: {nst.pre_depth.toFixed(2)} m mbgl
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectStation(nst)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-sky-600 hover:bg-sky-700 transition cursor-pointer shrink-0"
                      >
                        Inspect
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* View All Stations Toggle Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setAllStationsOpen(!allStationsOpen)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition cursor-pointer"
                >
                  {allStationsOpen ? 'Hide Full Station Directory' : 'View All 118 Tripura Stations'}
                </button>
              </div>

              {/* Expandable Directory Table */}
              {allStationsOpen && (
                <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter stations by name or PIN..."
                        value={stationFilter}
                        onChange={(e) => setStationFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Showing {filteredAllStations.length} of {allStations.length}
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredAllStations.slice(0, 50).map((st) => (
                      <div
                        key={st.id}
                        className="py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-lg"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {st.location}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-2">
                            ({st.district}, PIN {st.pincode})
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 dark:text-slate-300 font-mono">
                            {st.pre_depth.toFixed(2)} m
                          </span>
                          <button
                            type="button"
                            onClick={() => onSelectStation(st)}
                            className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
