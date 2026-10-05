import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TRIPURA_STATIONS, calculateDistanceKm } from './data/tripuraData';
import { HydroStation } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageModal } from './components/LanguageModal';

// Clean, minimal, water-centric components with authentic Tripura photographic heritage
import { CleanNavbar } from './components/CleanNavbar';
import { CleanHero } from './components/CleanHero';
import { SectionLocationSearch } from './components/SectionLocationSearch';
import { SectionGroundwaterOverview } from './components/SectionGroundwaterOverview';
import { SectionMapAndStation } from './components/SectionMapAndStation';
import { StationDetailsDrawer } from './components/StationDetailsDrawer';
import { SectionGroundwaterProfile } from './components/SectionGroundwaterProfile';
import { SectionDrillingDecision } from './components/SectionDrillingDecision';
import { SectionFinalReport } from './components/SectionFinalReport';

function GroundwaterPlatform() {
  // Primary District & Station State
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<HydroStation | null>(null);
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);

  // Filter stations by selected district
  const filteredStations = useMemo(() => {
    if (selectedDistrict === 'ALL') return TRIPURA_STATIONS;
    return TRIPURA_STATIONS.filter((s) => s.district === selectedDistrict);
  }, [selectedDistrict]);

  // If district filter changes, ensure active station belongs to district or reset
  useEffect(() => {
    if (selectedStation && selectedDistrict !== 'ALL' && selectedStation.district !== selectedDistrict) {
      setSelectedStation(null);
    }
  }, [selectedDistrict, selectedStation]);

  // GPS Locate Action: finds nearest CGWB well
  const handleLocateGps = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        setDroppedPin({ lat: userLat, lng: userLng });

        // Find nearest station in Tripura
        let nearest = TRIPURA_STATIONS[0];
        let minDistance = Infinity;

        TRIPURA_STATIONS.forEach((st) => {
          const dist = calculateDistanceKm(userLat, userLng, st.lat, st.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = st;
          }
        });

        setSelectedStation(nearest);
        if (selectedDistrict !== 'ALL' && nearest.district !== selectedDistrict) {
          setSelectedDistrict('ALL');
        }
        setIsLocating(false);

        // Smooth scroll to Overview or Map
        const el = document.getElementById('section-overview');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      (err) => {
        console.warn('GPS location failed or timed out:', err);
        setIsLocating(false);
        // Default to Agartala capital coordinates
        setDroppedPin({ lat: 23.8315, lng: 91.2868 });
        const el = document.getElementById('section-overview');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [selectedDistrict]);

  // Drop Pin Handler on Map
  const handleDropPin = useCallback((coords: { lat: number; lng: number }) => {
    setDroppedPin(coords);
    let nearest = TRIPURA_STATIONS[0];
    let minDistance = Infinity;
    TRIPURA_STATIONS.forEach((st) => {
      const dist = calculateDistanceKm(coords.lat, coords.lng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = st;
      }
    });
    setSelectedStation(nearest);
  }, []);

  // Print Hydrogeological Report
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Navigation scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const focusSearchInput = () => {
    scrollTo('section-search');
    setTimeout(() => {
      const input = document.getElementById('station-search-input') as HTMLInputElement | null;
      if (input) {
        input.focus();
      }
    }, 400);
  };

  // Currently displayed station (selected or baseline default)
  const displayStation =
    selectedStation ||
    TRIPURA_STATIONS.find((s) => s.location.includes('Agartala')) ||
    TRIPURA_STATIONS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. Compact, Clean Sticky Navigation Bar */}
      <CleanNavbar
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        onLocateGps={handleLocateGps}
        isLocating={isLocating}
        onPrintReport={handlePrint}
        onTriggerSearch={focusSearchInput}
        stationCount={TRIPURA_STATIONS.length}
      />

      {/* Multilingual Support Modal */}
      <LanguageModal />

      {/* Slide-over Drawer for Full Station Details */}
      <StationDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        station={displayStation}
      />

      {/* Main Content: The 8 Clean Sections */}
      <main className="w-full overflow-x-hidden">
        {/* 01 — HERO */}
        <CleanHero
          totalStations={TRIPURA_STATIONS.length}
          onExplore={() => scrollTo('section-search')}
          onSearch={focusSearchInput}
        />

        {/* 02 — SEARCH / LOCATION */}
        <SectionLocationSearch
          stations={filteredStations}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
          onSelectStation={(st) => setSelectedStation(st)}
          onDropPin={handleDropPin}
          onLocateGps={handleLocateGps}
          isLocating={isLocating}
        />

        {/* 03 — GROUNDWATER OVERVIEW */}
        <SectionGroundwaterOverview
          station={displayStation}
          onViewDetails={() => setIsDetailsDrawerOpen(true)}
        />

        {/* 04 — MAP + MONITORING STATION */}
        <SectionMapAndStation
          stations={filteredStations}
          selectedStation={selectedStation}
          onSelectStation={(st) => setSelectedStation(st)}
          droppedPin={droppedPin}
          onDropPin={handleDropPin}
          selectedDistrict={selectedDistrict}
          onViewFullStationDetails={() => setIsDetailsDrawerOpen(true)}
        />

        {/* 06 — GROUNDWATER PROFILE */}
        <SectionGroundwaterProfile station={displayStation} />

        {/* 07 — DRILLING DECISION */}
        <SectionDrillingDecision station={displayStation} />

        {/* 08 — FINAL REPORT */}
        <SectionFinalReport
          station={displayStation}
          onSearchAnother={focusSearchInput}
          onPrint={handlePrint}
        />
      </main>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GroundwaterPlatform />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
