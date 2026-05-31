import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PIN_HEX, PINS, UCSD } from '../data/pins';
import type { EventPin, MapFilter } from '../types';
import 'leaflet/dist/leaflet.css';

function pinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;background:${color};border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
  });
}

function Resize() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 120);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export function CampusMap({
  filter,
  onSave,
  saved,
}: {
  filter: MapFilter;
  onSave?: (id: string) => void;
  saved?: Set<string>;
}) {
  const list = filter === 'All' ? PINS : PINS.filter((p) => p.category === filter);

  return (
    <div className="map-wrap">
      <MapContainer center={UCSD} zoom={16} zoomControl={false} attributionControl={false} className="map-leaf">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Resize />
        {list.map((p: EventPin) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(PIN_HEX[p.color])}>
            <Popup>
              <strong>{p.title}</strong>
              {p.club && <div style={{ fontSize: 12, color: '#666' }}>{p.club}</div>}
              {onSave && (
                <button type="button" style={{ marginTop: 8, width: '100%' }} onClick={() => onSave(p.id)}>
                  {saved?.has(p.id) ? 'Saved ✓' : 'Save event'}
                </button>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style>{`
        .map-wrap{flex:1;min-height:0;background:var(--map-bg)}
        .map-leaf{width:100%;height:100%}
        .leaflet-container{font-family:var(--font)}
      `}</style>
    </div>
  );
}
