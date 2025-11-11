export interface Location {
  lat: number;
  lng: number;
  accuracy_meters?: number;
  altitude_meters?: number;
}

export interface Movement {
  speed_kmh: number;
  heading_degrees: number;
  moving: boolean;
}

export interface Device {
  battery_level: number;
  charging: boolean;
}

export interface Telemetry {
  odometer_km: number;
  fuel_level_percent: number;
  engine_hours: number;
  coolant_temp_celsius: number;
  oil_pressure_kpa: number;
  battery_voltage: number;
}

export interface FleetEvent {
  event_id: string;
  event_type: string;
  timestamp: string;
  vehicle_id: string;
  trip_id: string;
  device_id?: string;
  location: Location;
  movement?: Movement;
  distance_travelled_km?: number;
  signal_quality?: string;
  device?: Device;
  overspeed?: boolean;
  planned_distance_km?: number;
  estimated_duration_hours?: number;
  total_distance_km?: number;
  duration_minutes?: number;
  fuel_consumed_percent?: number;
  cancellation_reason?: string;
  distance_completed_km?: number;
  elapsed_time_minutes?: number;
  telemetry?: Telemetry;
  error_type?: string;
  error_code?: string;
  error_message?: string;
  severity?: string;
  speed_limit_kmh?: number;
  violation_amount_kmh?: number;
  stop_duration_minutes?: number;
  battery_level_percent?: number;
  threshold_percent?: number;
  estimated_remaining_hours?: number;
  fuel_level_percent?: number;
  estimated_range_km?: number;
  refuel_duration_minutes?: number;
  fuel_level_after_refuel?: number;
  fuel_added_percent?: number;
  signal_lost_duration_seconds?: number;
  signal_quality_after_recovery?: string;
}

export interface TripData {
  tripId: string;
  vehicleId: string;
  events: FleetEvent[];
  tripName: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface TripMetrics {
  tripId: string;
  vehicleId: string;
  tripName: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  currentSpeed: number;
  distanceTravelled: number;
  totalDistance: number;
  fuelLevel: number;
  batteryLevel: number;
  lastLocation: Location;
  alerts: Alert[];
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export interface Alert {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  eventType: string;
}

export interface FleetMetrics {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalDistance: number;
  averageSpeed: number;
  totalAlerts: number;
  criticalAlerts: number;
}
