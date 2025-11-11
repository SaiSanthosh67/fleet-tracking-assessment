import type { FleetEvent, TripData, TripMetrics, FleetMetrics, Alert } from '../types/fleet';

export function calculateTripMetrics(trip: TripData, currentEvents: FleetEvent[]): TripMetrics {
  const tripEvents = currentEvents.filter(e => e.trip_id === trip.tripId);
  
  if (tripEvents.length === 0) {
    return {
      tripId: trip.tripId,
      vehicleId: trip.vehicleId,
      tripName: trip.tripName,
      status: 'active',
      progress: 0,
      currentSpeed: 0,
      distanceTravelled: 0,
      totalDistance: 0,
      fuelLevel: 100,
      batteryLevel: 100,
      lastLocation: { lat: 0, lng: 0 },
      alerts: []
    };
  }

  const latestEvent = tripEvents[tripEvents.length - 1];
  const firstEvent = trip.events[0];
  
  const totalDistance = firstEvent.planned_distance_km || 0;
  const distanceTravelled = latestEvent.distance_travelled_km || 0;
  const progress = totalDistance > 0 ? (distanceTravelled / totalDistance) * 100 : 0;

  const currentSpeed = latestEvent.movement?.speed_kmh || 0;
  const fuelLevel = latestEvent.telemetry?.fuel_level_percent || 
                     (latestEvent.fuel_level_percent !== undefined ? latestEvent.fuel_level_percent : 100);
  const batteryLevel = latestEvent.device?.battery_level || 100;
  const lastLocation = latestEvent.location;

  const alerts = generateAlerts(tripEvents);

  let status: 'active' | 'completed' | 'cancelled' = 'active';
  if (latestEvent.event_type === 'trip_completed') {
    status = 'completed';
  } else if (latestEvent.event_type === 'trip_cancelled') {
    status = 'cancelled';
  }

  return {
    tripId: trip.tripId,
    vehicleId: trip.vehicleId,
    tripName: trip.tripName,
    status,
    progress: Math.min(progress, 100),
    currentSpeed,
    distanceTravelled,
    totalDistance,
    fuelLevel,
    batteryLevel,
    lastLocation,
    alerts,
    startTime: firstEvent.timestamp,
    endTime: latestEvent.event_type === 'trip_completed' || latestEvent.event_type === 'trip_cancelled' 
      ? latestEvent.timestamp : undefined,
    duration: latestEvent.duration_minutes
  };
}

export function calculateFleetMetrics(trips: TripData[], currentEvents: FleetEvent[]): FleetMetrics {
  const tripMetrics = trips.map(trip => calculateTripMetrics(trip, currentEvents));
  
  const totalTrips = trips.length;
  const activeTrips = tripMetrics.filter(m => m.status === 'active').length;
  const completedTrips = tripMetrics.filter(m => m.status === 'completed').length;
  const cancelledTrips = tripMetrics.filter(m => m.status === 'cancelled').length;
  
  const totalDistance = tripMetrics.reduce((sum, m) => sum + m.distanceTravelled, 0);
  const speeds = tripMetrics.filter(m => m.currentSpeed > 0).map(m => m.currentSpeed);
  const averageSpeed = speeds.length > 0 
    ? speeds.reduce((sum, s) => sum + s, 0) / speeds.length 
    : 0;
  
  const allAlerts = tripMetrics.flatMap(m => m.alerts);
  const totalAlerts = allAlerts.length;
  const criticalAlerts = allAlerts.filter(a => a.type === 'error').length;

  return {
    totalTrips,
    activeTrips,
    completedTrips,
    cancelledTrips,
    totalDistance,
    averageSpeed,
    totalAlerts,
    criticalAlerts
  };
}

function generateAlerts(events: FleetEvent[]): Alert[] {
  const alerts: Alert[] = [];
  const recentEvents = events.slice(-20);

  for (const event of recentEvents) {
    switch (event.event_type) {
      case 'speed_violation':
        alerts.push({
          type: 'warning',
          message: `Speed violation: ${event.movement?.speed_kmh}km/h (limit: ${event.speed_limit_kmh}km/h)`,
          timestamp: event.timestamp,
          eventType: event.event_type
        });
        break;
      case 'fuel_level_low':
        alerts.push({
          type: 'warning',
          message: `Low fuel: ${event.fuel_level_percent}%`,
          timestamp: event.timestamp,
          eventType: event.event_type
        });
        break;
      case 'battery_low':
        alerts.push({
          type: 'warning',
          message: `Low battery: ${event.battery_level_percent}%`,
          timestamp: event.timestamp,
          eventType: event.event_type
        });
        break;
      case 'device_error':
        alerts.push({
          type: 'error',
          message: `Device error: ${event.error_message}`,
          timestamp: event.timestamp,
          eventType: event.event_type
        });
        break;
      case 'signal_lost':
        alerts.push({
          type: 'warning',
          message: 'GPS signal lost',
          timestamp: event.timestamp,
          eventType: event.event_type
        });
        break;
      case 'trip_cancelled':
        alerts.push({
          type: 'error',
          message: `Trip cancelled: ${event.cancellation_reason}`,
          timestamp: event.timestamp,
          eventType: event.event_type
        });
        break;
    }
  }

  return alerts.slice(-5);
}
