'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import type { Event } from '@/lib/types';
import { Button } from '../ui/button';

interface EventMapProps {
  events: Event[];
}

export default function EventMap({ events }: EventMapProps) {

  return (
    <MapContainer
      center={[52.3676, 4.9041]}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[
            event.location.latitude,
            event.location.longitude,
          ]}
        >
          <Popup>
            <div className="p-1 max-w-xs">
              <h3 className="font-bold font-headline text-lg mb-1">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {event.description.substring(0, 100)}...
              </p>
              <Button size="sm">View Details</Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
