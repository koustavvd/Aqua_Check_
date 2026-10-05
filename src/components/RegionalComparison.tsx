import React, { useState } from 'react';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { HydroStation } from '../types';
import { getStationRiskCategory, calculateWellDepth } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { WaterTextBg } from './WaterTextBg';

interface RegionalComparisonProps {
  stations: HydroStation[];
  currentStation: HydroStation;
  onSelectStation: (station: HydroStation) => void;
}

export const RegionalComparison: React.FC<RegionalComparisonProps> = ({
  stations,
  currentStation,
  onSelectStation,
}) => {
  const { t, formatNum, getDistrictName } = useLanguage();
  const [filterType, setFilterType] = useState<'ALL' | 'DUG' | 'PZ'>('ALL');
  const [sortBy, setSortBy] = useState<'depth' | 'risk' | 'trend'>('depth');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter stations in the same district or block
  const districtStations = stations.filter((s) => {
    const matchesDistrict = s.district === currentStation.district;
    if (filterType === 'ALL') return matchesDistrict;
    return matchesDistrict && s.type === filterType;
  });

  // Sort
  const sortedStations = [...districtStations].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'depth') {
      diff = a.pre_depth - b.pre_depth;
    } else if (sortBy === 'risk') {
      diff = a.risk - b.risk;
    } else if (sortBy === 'trend') {
      const trendA = a.trend_fall > 0 ? -a.trend_fall : a.trend_rise;
      const trendB = b.trend_fall > 0 ? -b.trend_fall : b.trend_rise;
      diff = trendA - trendB;
    }
    return sortOrder === 'asc' ? diff : -diff;
  });

  const handleSort = (type: 'depth' | 'risk' | 'trend') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  return (
    <div className="card-3d-glass rounded-xl p-4 sm:p-6 transition-all shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
            {t.regionalTelemetryComparison}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            <WaterTextBg variant="title">
              {t.nearbyStationsIn(getDistrictName(currentStation.district), districtStations.length)}
            </WaterTextBg>
          </h3>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-white/40 dark:bg-slate-900/40 p-1 rounded-lg border border-white/60 dark:border-sky-500/20 backdrop-blur-xs text-xs">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              filterType === 'ALL'
                ? 'bg-white/95 dark:bg-sky-900/80 text-sky-950 dark:text-sky-100 shadow-xs border border-sky-200 dark:border-sky-600 font-semibold'
                : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.allTypes}
          </button>
          <button
            type="button"
            onClick={() => setFilterType('DUG')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              filterType === 'DUG'
                ? 'bg-white/95 dark:bg-sky-900/80 text-sky-950 dark:text-sky-100 shadow-xs border border-sky-200 dark:border-sky-600 font-semibold'
                : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.dugWells}
          </button>
          <button
            type="button"
            onClick={() => setFilterType('PZ')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              filterType === 'PZ'
                ? 'bg-white/95 dark:bg-sky-900/80 text-sky-950 dark:text-sky-100 shadow-xs border border-sky-200 dark:border-sky-600 font-semibold'
                : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {t.piezometers}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-sky-500/20 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <th className="py-2.5 px-2 font-medium">{t.stationAndLocation}</th>
              <th className="py-2.5 px-2 font-medium">{t.type}</th>
              <th className="py-2.5 px-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('depth')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <span>{t.waterLevelMeters}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-2 font-medium">{t.wellDepthMeters}</th>
              <th className="py-2.5 px-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('trend')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <span>{t.trendMYr}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-2 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort('risk')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <span>{t.vulnerability}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-2 text-right">{t.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-sky-500/15">
            {sortedStations.map((st) => {
              const isSelected = st.id === currentStation.id;
              const risk = getStationRiskCategory(st.risk);
              const wellDepth = calculateWellDepth(st.pre_depth);
              const localizedRiskLabel = risk.tier === 'low'
                ? t.lowVulnerability
                : risk.tier === 'moderate'
                ? t.moderateVulnerability
                : t.highVulnerability;

              return (
                <tr
                  key={st.id}
                  onClick={() => onSelectStation(st)}
                  className={`cursor-pointer transition hover:bg-white/40 dark:hover:bg-sky-950/40 ${
                    isSelected ? 'bg-sky-100/60 dark:bg-sky-950/50 font-semibold' : ''
                  }`}
                >
                  <td className="py-2.5 px-2">
                    <div className="text-slate-900 dark:text-slate-100">
                      {st.location}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      {st.block} {t.blockSuffix} • PIN {st.pincode}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 font-mono">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border border-white/60 dark:border-sky-500/20">
                      {st.type === 'DUG' ? t.dugWell : t.piezometer}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-slate-800 dark:text-slate-200">
                    {formatNum(st.pre_depth)} {t.meters}
                  </td>
                  <td className="py-2.5 px-2 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatNum(wellDepth)} {t.meters}
                  </td>
                  <td className="py-2.5 px-2 font-mono">
                    {st.trend_fall > 0 ? (
                      <span className="text-amber-700 dark:text-amber-400">-{formatNum(st.trend_fall)}</span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400">+{formatNum(st.trend_rise)}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${risk.bg} ${risk.text} ${risk.border}`}>
                      {formatNum(risk.score)}/100 • {localizedRiskLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="inline-flex items-center text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                      {t.view} <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
