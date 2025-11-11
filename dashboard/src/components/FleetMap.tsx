import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TripMetrics } from '../types/fleet';
import { useEffect, useRef } from 'react';

interface Props {
  tripMetrics: TripMetrics[];
  selectedTripId: string | null;
}

const createVehicleIcon = (status: string) => {
  const colors: Record<string, string> = {
    active: '#22c55e',
    completed: '#3b82f6',
    cancelled: '#ef4444'
  };
  
  const color = colors[status] || '#22c55e';
  
  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="3"/>
        <path d="M16 10 L20 16 L16 22 L12 16 Z" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export function FleetMap({ tripMetrics, selectedTripId }: Props) {
  const mapRef = useRef<L.Map>(null);

  const center: LatLngExpression = [39.8283, -98.5795];

  useEffect(() => {
    if (mapRef.current && tripMetrics.length > 0) {
      const bounds = tripMetrics
        .filter(m => m.lastLocation.lat !== 0 && m.lastLocation.lng !== 0)
        .map(m => [m.lastLocation.lat, m.lastLocation.lng] as LatLngExpression);
      
      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds as any, { padding: [50, 50] });
      }
    }
  }, [tripMetrics]);

  return (
    <div className="fleet-map">
      <MapContainer
        center={center}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {tripMetrics.map(trip => {
          if (trip.lastLocation.lat === 0 && trip.lastLocation.lng === 0) return null;
          
          const isSelected = selectedTripId === trip.tripId;
          
          return (
            <Marker
              key={trip.tripId}
              position={[trip.lastLocation.lat, trip.lastLocation.lng]}
              icon={createVehicleIcon(trip.status)}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Popup>
                <div className="map-popup">
                  <h4>{trip.tripName}</h4>
                  <p><strong>Vehicle:</strong> {trip.vehicleId}</p>
                  <p><strong>Status:</strong> {trip.status}</p>
                  <p><strong>Progress:</strong> {trip.progress.toFixed(1)}%</p>
                  <p><strong>Speed:</strong> {trip.currentSpeed.toFixed(0)} km/h</p>
                  <p><strong>Distance:</strong> {trip.distanceTravelled.toFixed(0)} km</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
