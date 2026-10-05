import React from 'react';
import { ShieldCheck, TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { WaterDropIcon } from './WaterDropIcon';
import { IMAGES } from '../assets/images';

interface SectionGroundwaterOverviewProps {
  station: HydroStation;
  onViewDetails: () => void;
}

export const SectionGroundwaterOverview: React.FC<SectionGroundwaterOverviewProps> = ({
  station,
  onViewDetails,
}) => {
  const wellDepth = calculateWellDepth(station.pre_depth);
  const riskInfo = getStationRiskCategory(station.risk);

  const hasDecline = station.trend_fall > 0;
  const hasRise = station.trend_rise > 0;
  const trendVal = hasDecline
    ? `-${station.trend_fall.toFixed(2)} m/yr`
    : hasRise
    ? `+${station.trend_rise.toFixed(2)} m/yr`
    : '0.00 m/yr';

  return (
    <section
      id="section-overview"
      className="relative min-h-[500px] py-20 px-4 sm:px-6 flex items-center justify-center overflow-hidden"
    >
      {/* 1. Full-Width Heritage Photograph Background: Ujjayanta Palace */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={IMAGES.ujjayantaPalaceWater}
          alt="Ujjayanta Palace and Water Gardens, Agartala, Tripura"
          className="w-full h-full object-cover object-center filter brightness-[0.40] contrast-[1.05]"
        />
        {/* Soft translucent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/80 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. Content Frame */}
      <div className="relative z-10 max-w-6xl w-full mx-auto">
        {/* Location Eyebrow & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sky-200 text-xs font-semibold mb-3">
            <WaterDropIcon className="w-3.5 h-3.5" />
            <span>Station Telemetry • {station.district} District</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
            {station.location} Groundwater Summary
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-normal">
            Essential subterranean measurements recorded by the Central Ground Water Board.
          </p>
        </div>

        {/* 3. Clean Horizontal Composition with Large Elegant Numbers (Not 4 bulky cards) */}
        <div className="rounded-3xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl p-6 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {/* Metric 1: Water Level */}
            <div className="flex flex-col pt-4 sm:pt-0 sm:pr-6">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <WaterDropIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Water Level</span>
              </span>
              <div className="mt-2 text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {station.pre_depth.toFixed(2)}
                <span className="text-base sm:text-lg font-normal text-slate-300 ml-1">m</span>
              </div>
              <span className="mt-1 text-xs text-slate-300">Static depth mbgl</span>
            </div>

            {/* Metric 2: Well Depth */}
            <div className="flex flex-col pt-4 sm:pt-0 sm:px-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Well Depth</span>
              </span>
              <div className="mt-2 text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {wellDepth.toFixed(2)}
                <span className="text-base sm:text-lg font-normal text-slate-300 ml-1">m</span>
              </div>
              <span className="mt-1 text-xs text-slate-300">Recommended target</span>
            </div>

            {/* Metric 3: Vulnerability */}
            <div className="flex flex-col pt-4 sm:pt-0 sm:px-6">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <WaterDropIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Vulnerability</span>
              </span>
              <div className="mt-2 text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {riskInfo.score}
                <span className="text-base sm:text-lg font-normal text-slate-300 ml-1">/ 100</span>
              </div>
              <span className={`mt-1 text-xs font-semibold ${riskInfo.text}`}>
                {riskInfo.label} Risk Tier
              </span>
            </div>

            {/* Metric 4: Groundwater Trend */}
            <div className="flex flex-col pt-4 sm:pt-0 sm:pl-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                {hasDecline ? (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                ) : hasRise ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span>10-Yr Trend</span>
              </span>
              <div className="mt-2 text-3xl sm:text-5xl font-bold text-white tracking-tight">
                {trendVal}
              </div>
              <span className="mt-1 text-xs text-slate-300">
                {hasDecline ? 'Seasonal drop' : hasRise ? 'Net recharge' : 'Equilibrium'}
              </span>
            </div>
          </div>

          {/* ONE Button: View Groundwater Details */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-300">
              Lithology: <strong className="text-white">{station.terrain}</strong> • Village: {station.village}
            </span>
            <button
              type="button"
              onClick={onViewDetails}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer group"
            >
              <span>View Groundwater Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
