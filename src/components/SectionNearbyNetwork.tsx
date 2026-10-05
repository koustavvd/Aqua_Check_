import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Check,
  Filter
} from 'lucide-react';
import { HydroStation } from '../types';
import { calculateDistanceKm, calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';

interface SectionNearbyNetworkProps {
  stations: HydroStation[];
  selectedStation: HydroStation;
  onSelectStation: (station: HydroStation) => void;
}

export const SectionNearbyNetwork: React.FC<SectionNearbyNetworkProps> = ({
  stations,
  selectedStation,
  onSelectStation,
}) => {
  const { t, formatNum } = useLanguage();
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [tableQuery, setTableQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'DUG' | 'PZ'>('ALL');

  // Compute nearby stations sorted by geographical distance
  const nearbyStations = stations
    .filter((s) => s.id !== selectedStation.id)
    .map((s) => ({
      ...s,
      distanceKm: calculateDistanceKm(selectedStation.lat, selectedStation.lng, s.lat, s.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  // Filter full table stations
  const cleanQ = tableQuery.trim().toLowerCase();
  const filteredTableStations = stations.filter((s) => {
    const matchesQuery =
      cleanQ === '' ||
      s.location.toLowerCase().includes(cleanQ) ||
      s.village.toLowerCase().includes(cleanQ) ||
      s.district.toLowerCase().includes(cleanQ) ||
      s.pincode.includes(cleanQ);

    const matchesType = typeFilter === 'ALL' || s.type === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <section
      id="section-nearby-network"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="max-w-2xl mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <Radio className="w-3.5 h-3.5" />
          <span>PHASE X • SPATIAL PROXIMITY TELEMETRY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Nearby Station Network
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Hydrogeological correlation with monitoring wells surrounding {selectedStation.location} within a 30 km radius.
        </p>
      </div>

      {/* Proximity Cards Grid (Spatial Intelligence View) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {nearbyStations.map((st) => {
          const vuln = getStationRiskCategory(st.risk);
          const wellD = calculateWellDepth(st.pre_depth);

          return (
            <div
              key={st.id}
              onClick={() => onSelectStation(st)}
              className="p-5 rounded-2xl bg-slate-950/70 hover:bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/80 transition-all duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                    {st.distanceKm} km away
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${vuln.border} ${vuln.bg} ${vuln.text}`}>
                    {vuln.tier.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {st.location}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {st.district} • {st.type === 'DUG' ? 'Dug Well' : 'Piezometer'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">WATER LEVEL</span>
                    <span className="text-cyan-300 font-bold">{st.pre_depth} m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">WELL DEPTH</span>
                    <span className="text-white font-bold">{wellD} m</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Inspect Station #{st.id}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse Button for Full Network Table */}
      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/40 text-cyan-300 font-mono text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
        >
          <span>{isTableExpanded ? 'COLLAPSE STATION NETWORK' : 'EXPAND STATION NETWORK (118 STATIONS)'}</span>
          {isTableExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Comprehensive 118 Station Table */}
      {isTableExpanded && (
        <div className="p-6 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 shadow-2xl space-y-4 animate-in fade-in duration-300">
          {/* Table Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableQuery}
                onChange={(e) => setTableQuery(e.target.value)}
                placeholder="Filter table by station name, village, or pincode..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  typeFilter === 'ALL'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                All ({filteredTableStations.length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('DUG')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  typeFilter === 'DUG'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Dug Wells
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('PZ')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  typeFilter === 'PZ'
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Piezometers
              </button>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto max-h-[440px] scrollbar-thin">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-900 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Station & Location</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Water Level (m)</th>
                  <th className="py-2.5 px-3">Well Depth (m)</th>
                  <th className="py-2.5 px-3">Trend (m/yr)</th>
                  <th className="py-2.5 px-3">Vulnerability</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredTableStations.map((st) => {
                  const isSelected = st.id === selectedStation.id;
                  const vuln = getStationRiskCategory(st.risk);
                  const wellD = calculateWellDepth(st.pre_depth);

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-cyan-950/30 transition-colors ${
                        isSelected ? 'bg-cyan-950/50' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-white">
                        <div className="flex items-center gap-1.5">
                          {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                          <span>{st.location}</span>
                          <span className="text-slate-400 font-normal">#{st.id}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{st.village}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{st.district}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          st.type === 'DUG'
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30'
                            : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                        }`}>
                          {st.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-cyan-300">{st.pre_depth}</td>
                      <td className="py-2.5 px-3 text-white">{wellD}</td>
                      <td className="py-2.5 px-3">
                        {st.trend_fall > 0 ? (
                          <span className="text-rose-400">-{st.trend_fall}</span>
                        ) : st.trend_rise > 0 ? (
                          <span className="text-emerald-400">+{st.trend_rise}</span>
                        ) : (
                          <span className="text-slate-400">0.00</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${vuln.border} ${vuln.bg} ${vuln.text}`}>
                          {vuln.tier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectStation(st)}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-white/10 transition cursor-pointer"
                        >
                          {isSelected ? 'Selected' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
