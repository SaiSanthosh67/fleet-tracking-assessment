import type { TripMetrics } from '../types/fleet';
import { Fuel, Battery, AlertCircle, Navigation, Gauge } from 'lucide-react';

interface Props {
  metrics: TripMetrics;
  onClick: () => void;
}

export function TripCard({ metrics, onClick }: Props) {
  const getStatusClass = () => {
    switch (metrics.status) {
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-active';
    }
  };

  const getStatusText = () => {
    switch (metrics.status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Active';
    }
  };

  return (
    <div className={`trip-card ${getStatusClass()}`} onClick={onClick}>
      <div className="trip-card-header">
        <div>
          <h3>{metrics.tripName}</h3>
          <p className="vehicle-id">{metrics.vehicleId}</p>
        </div>
        <span className={`status-badge ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${metrics.progress}%` }}
          />
        </div>
        <span className="progress-text">{metrics.progress.toFixed(1)}%</span>
      </div>

      <div className="trip-stats">
        <div className="stat">
          <Navigation size={16} />
          <span>{metrics.distanceTravelled.toFixed(0)} / {metrics.totalDistance.toFixed(0)} km</span>
        </div>
        <div className="stat">
          <Gauge size={16} />
          <span>{metrics.currentSpeed.toFixed(0)} km/h</span>
        </div>
      </div>

      <div className="trip-vitals">
        <div className={`vital ${metrics.fuelLevel < 20 ? 'vital-low' : ''}`}>
          <Fuel size={16} />
          <span>{metrics.fuelLevel.toFixed(0)}%</span>
        </div>
        <div className={`vital ${metrics.batteryLevel < 20 ? 'vital-low' : ''}`}>
          <Battery size={16} />
          <span>{metrics.batteryLevel.toFixed(0)}%</span>
        </div>
      </div>

      {metrics.alerts.length > 0 && (
        <div className="trip-alerts">
          <AlertCircle size={14} />
          <span>{metrics.alerts.length} alert{metrics.alerts.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}
