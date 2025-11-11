import { useState, useEffect } from 'react';
import type { TripData } from './types/fleet';
import { loadAllTrips } from './utils/dataLoader';
import { calculateTripMetrics, calculateFleetMetrics } from './utils/metricsCalculator';
import { useSimulation } from './hooks/useSimulation';
import { FleetOverview } from './components/FleetOverview';
import { TripCard } from './components/TripCard';
import { TripDetail } from './components/TripDetail';
import { PlaybackControls } from './components/PlaybackControls';
import { FleetMap } from './components/FleetMap';
import './App.css';

function App() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const {
    isPlaying,
    speed,
    currentTime,
    currentEvents,
    progress,
    play,
    pause,
    reset,
    changeSpeed,
    skipTo
  } = useSimulation(trips);

  useEffect(() => {
    loadAllTrips().then(loadedTrips => {
      setTrips(loadedTrips);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading fleet data...</p>
      </div>
    );
  }

  const tripMetrics = trips.map(trip => calculateTripMetrics(trip, currentEvents));
  const fleetMetrics = calculateFleetMetrics(trips, currentEvents);
  const selectedTrip = selectedTripId 
    ? tripMetrics.find(m => m.tripId === selectedTripId) 
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Fleet Tracking Dashboard</h1>
        <p className="subtitle">Real-time vehicle monitoring and fleet management</p>
      </header>

      <PlaybackControls
        isPlaying={isPlaying}
        speed={speed}
        progress={progress}
        currentTime={currentTime}
        onPlay={play}
        onPause={pause}
        onReset={reset}
        onSpeedChange={changeSpeed}
        onProgressChange={skipTo}
      />

      <div className="dashboard-container">
        <div className="dashboard-left">
          <FleetOverview metrics={fleetMetrics} />

          <div className="trips-section">
            <h2>Active Trips</h2>
            <div className="trips-grid">
              {tripMetrics.map(trip => (
                <TripCard
                  key={trip.tripId}
                  metrics={trip}
                  onClick={() => setSelectedTripId(trip.tripId)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <FleetMap 
            tripMetrics={tripMetrics}
            selectedTripId={selectedTripId}
          />
        </div>
      </div>

      {selectedTrip && (
        <TripDetail
          metrics={selectedTrip}
          onClose={() => setSelectedTripId(null)}
        />
      )}
    </div>
  );
}

export default App;
