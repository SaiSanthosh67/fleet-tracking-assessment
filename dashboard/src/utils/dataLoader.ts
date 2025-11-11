import type { FleetEvent, TripData } from '../types/fleet';

const tripFiles = [
  { path: '/data/trip_1_cross_country.json', name: 'Cross-Country Long Haul' },
  { path: '/data/trip_2_urban_dense.json', name: 'Urban Dense Delivery' },
  { path: '/data/trip_3_mountain_cancelled.json', name: 'Mountain Route Cancelled' },
  { path: '/data/trip_4_southern_technical.json', name: 'Southern Technical Issues' },
  { path: '/data/trip_5_regional_logistics.json', name: 'Regional Logistics' }
];

export async function loadAllTrips(): Promise<TripData[]> {
  const trips: TripData[] = [];

  for (const file of tripFiles) {
    try {
      const response = await fetch(file.path);
      const events: FleetEvent[] = await response.json();
      
      if (events.length > 0) {
        const firstEvent = events[0];
        const lastEvent = events[events.length - 1];
        
        let status: 'active' | 'completed' | 'cancelled' = 'active';
        if (lastEvent.event_type === 'trip_completed') {
          status = 'completed';
        } else if (lastEvent.event_type === 'trip_cancelled') {
          status = 'cancelled';
        }

        trips.push({
          tripId: firstEvent.trip_id,
          vehicleId: firstEvent.vehicle_id,
          events: events.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          ),
          tripName: file.name,
          status
        });
      }
    } catch (error) {
      console.error(`Failed to load ${file.path}:`, error);
    }
  }

  return trips;
}

export function getAllEvents(trips: TripData[]): FleetEvent[] {
  const allEvents = trips.flatMap(trip => trip.events);
  return allEvents.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}
