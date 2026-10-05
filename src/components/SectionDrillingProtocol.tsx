import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle,
  HelpCircle,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { HydroStation } from '../types';
import { calculateWellDepth } from '../data/tripuraData';
import { generateHydrogeologicalAdvisory } from '../utils/advisoryGenerator';
import { useLanguage } from '../context/LanguageContext';

interface SectionDrillingProtocolProps {
  station: HydroStation;
}

export const SectionDrillingProtocol: React.FC<SectionDrillingProtocolProps> = ({ station }) => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const advisory = generateHydrogeologicalAdvisory(station, language);
  const waterLevel = station.pre_depth;
  const wellDepth = calculateWellDepth(waterLevel);

  const DRILLING_STAGES = [
    {
      step: '01',
      title: 'TARGET AQUIFER IDENTIFICATION',
      spec: `${advisory.riskAssessment.recommendedDepth}`,
      category: 'Geological Target',
      description: `Target the semi-consolidated porous sandstone beds of the Tipam Series between ${advisory.riskAssessment.recommendedDepth} to bypass seasonal water table drawdown.`,
      graphic: 'Borehole Spudding & Stratigraphic Target Verification',
    },
    {
      step: '02',
      title: 'DRILLING METHOD & RIG SELECTION',
      spec: 'Direct Rotary Rig with Bentonite Circulation',
      category: 'Machinery',
      description: 'Use direct rotary mud drilling (150–200mm diameter) for unconsolidated alluvial sands and Tipam sandstones. Avoid percussion rigs in soft shale lenses to prevent hole collapse.',
      graphic: 'Mud Pit Circulation & Rotary Bit Rotation',
    },
    {
      step: '03',
      title: 'CASING SPECIFICATION',
      spec: '150mm / 200mm ISI Class PVC',
      category: 'Casing Column',
      description: `Install heavy-duty ISI PVC casing pipe from surface (0.0 mbgl) down to the phreatic water level (${waterLevel} mbgl) with centralized spacers to ensure verticality.`,
      graphic: 'Solid Blind Casing Lowering into Borehole',
    },
    {
      step: '04',
      title: 'PRECISION SCREEN & STRAINER INTERVAL',
      spec: '0.5mm – 0.75mm Slotted PVC (3.5m Length)',
      category: 'Intake Filter',
      description: 'Position continuous-slot or precision machine-slotted PVC screen directly adjacent to the primary water-yielding sandstone layer, with bottom 0.8m blank pipe as sediment trap.',
      graphic: 'Slotted Screen Lowering to Water Horizon',
    },
    {
      step: '05',
      title: 'ANNULAR GRAVEL PACKING',
      spec: '2.0mm – 3.5mm Graded Pea Gravel',
      category: 'Filter Envelope',
      description: 'Slowly pour clean, rounded riverbed pea gravel down the annular space between the borehole wall and casing, extending at least 6 meters above the top strainer.',
      graphic: 'Annular Gravel Pack Envelope Formation',
    },
    {
      step: '06',
      title: 'WELL DEVELOPMENT (AIR COMPRESSOR)',
      spec: 'Minimum 4 Hours Continuous Air-Jetting',
      category: 'Cleaning & Fines Removal',
      description: 'Deploy a high-pressure air compressor (100–150 psi) to surge and backwash the filter envelope, dislodging drilled mud cake and micaceous silt until the discharge runs crystal clear.',
      graphic: 'Air Compressor Surging & Jetting',
    },
    {
      step: '07',
      title: 'YIELD & DRAWDOWN TEST (LPS DISCHARGE)',
      spec: 'Step-Drawdown Test & Recovery Monitoring',
      category: 'Hydraulic Verification',
      description: 'Conduct a standard submersible pumping test to calculate specific capacity (liters per second / meter drawdown) and confirm post-pumping groundwater recovery rates.',
      graphic: 'Submersible Pump Flow Measurement & Gauge Reading',
    },
  ];

  return (
    <section
      id="section-drilling"
      className="relative min-h-screen w-full py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none"
    >
      {/* Section Header */}
      <div className="max-w-2xl mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <Wrench className="w-3.5 h-3.5" />
          <span>PHASE VIII • PRE-DRILLING PROTOCOL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          7-Stage Drilling Sequence
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Standard Operating Procedure (SOP) based on Central Ground Water Board (CGWB) norms for drilling deep domestic and community tube wells in Tripura.
        </p>
      </div>

      {/* Main Grid: Left Stage Navigator + Right Active Stage Details & Contractor Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: 7 Step Stepper */}
        <div className="lg:col-span-5 space-y-2.5">
          {DRILLING_STAGES.map((stage, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isActive ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-400'
                  }`}>
                    {stage.step}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono truncate">{stage.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{stage.spec}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Step Detailed View & Contractor Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Step Showcase Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                STAGE {DRILLING_STAGES[activeStep].step} EXECUTION BRIEFING
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                {DRILLING_STAGES[activeStep].category}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              {DRILLING_STAGES[activeStep].title}
            </h3>

            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 font-mono text-xs text-cyan-200">
              <span className="text-slate-400 block text-[10px] uppercase">Engineering Specification:</span>
              <span className="text-sm font-bold text-cyan-300">{DRILLING_STAGES[activeStep].spec}</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {DRILLING_STAGES[activeStep].description}
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-white/10 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Action: {DRILLING_STAGES[activeStep].graphic}</span>
            </div>
          </div>

          {/* Contractor Critical Checklist (Ask Before Drilling) */}
          <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-wider">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              CRITICAL CONTRACTOR CHECKLIST (ASK BEFORE DRILLING)
            </div>

            <div className="space-y-3">
              {advisory.contractorQuestions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    ?
                  </span>
                  <p className="leading-relaxed font-sans">
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
