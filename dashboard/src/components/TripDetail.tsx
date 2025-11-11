import type { TripMetrics } from '../types/fleet';
import { X, MapPin, Clock, Fuel, Battery, AlertTriangle } from 'lucide-react';

interface Props {
  metrics: TripMetrics;
  onClose: () => void;
}

export function TripDetail({ metrics, onClose }: Props) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="trip-detail-overlay" onClick={onClose}>
      <div className="trip-detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="trip-detail-header">
          <h2>{metrics.tripName}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="trip-detail-content">
          <div className="detail-section">
            <h3>Trip Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Vehicle ID:</span>
                <span className="detail-value">{metrics.vehicleId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-${metrics.status}`}>
                  {metrics.status.toUpperCase()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Progress:</span>
                <span className="detail-value">{metrics.progress.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Distance & Speed</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Distance Travelled:</span>
                <span className="detail-value">{metrics.distanceTravelled.toFixed(2)} km</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Distance:</span>
                <span className="detail-value">{metrics.totalDistance.toFixed(2)} km</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Speed:</span>
                <span className="detail-value">{metrics.currentSpeed.toFixed(0)} km/h</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Vehicle Status</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <Fuel size={16} />
                <span className="detail-label">Fuel Level:</span>
                <span className={`detail-value ${metrics.fuelLevel < 20 ? 'text-warning' : ''}`}>
                  {metrics.fuelLevel.toFixed(1)}%
                </span>
              </div>
              <div className="detail-item">
                <Battery size={16} />
                <span className="detail-label">Battery Level:</span>
                <span className={`detail-value ${metrics.batteryLevel < 20 ? 'text-warning' : ''}`}>
                  {metrics.batteryLevel.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Location</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <MapPin size={16} />
                <span className="detail-label">Coordinates:</span>
                <span className="detail-value">
                  {metrics.lastLocation.lat.toFixed(4)}, {metrics.lastLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Timeline</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <Clock size={16} />
                <span className="detail-label">Start Time:</span>
                <span className="detail-value">{formatTime(metrics.startTime)}</span>
              </div>
              {metrics.endTime && (
                <div className="detail-item">
                  <Clock size={16} />
                  <span className="detail-label">End Time:</span>
                  <span className="detail-value">{formatTime(metrics.endTime)}</span>
                </div>
              )}
              {metrics.duration && (
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{metrics.duration} minutes</span>
                </div>
              )}
            </div>
          </div>

          {metrics.alerts.length > 0 && (
            <div className="detail-section">
              <h3>Recent Alerts</h3>
              <div className="alerts-list">
                {metrics.alerts.map((alert, index) => (
                  <div key={index} className={`alert-item alert-${alert.type}`}>
                    <AlertTriangle size={16} />
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">{formatTime(alert.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
