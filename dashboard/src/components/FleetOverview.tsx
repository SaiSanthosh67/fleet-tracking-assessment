import type { FleetMetrics } from '../types/fleet';
import { TrendingUp, Truck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  metrics: FleetMetrics;
}

export function FleetOverview({ metrics }: Props) {
  return (
    <div className="fleet-overview">
      <h2>Fleet Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Truck size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalTrips}</div>
            <div className="metric-label">Total Trips</div>
          </div>
        </div>

        <div className="metric-card active">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.activeTrips}</div>
            <div className="metric-label">Active</div>
          </div>
        </div>

        <div className="metric-card completed">
          <div className="metric-icon">
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.completedTrips}</div>
            <div className="metric-label">Completed</div>
          </div>
        </div>

        <div className="metric-card cancelled">
          <div className="metric-icon">
            <XCircle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.cancelledTrips}</div>
            <div className="metric-label">Cancelled</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-value">{metrics.totalDistance.toFixed(0)} km</div>
            <div className="metric-label">Total Distance</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-value">{metrics.averageSpeed.toFixed(0)} km/h</div>
            <div className="metric-label">Avg Speed</div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalAlerts}</div>
            <div className="metric-label">Alerts</div>
          </div>
        </div>

        <div className="metric-card error">
          <div className="metric-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.criticalAlerts}</div>
            <div className="metric-label">Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
}
