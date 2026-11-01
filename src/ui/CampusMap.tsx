import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PIN_HEX, PINS, UCSD } from '../data/pins';
import type { EventPin, MapFilter } from '../types';
import 'leaflet/dist/leaflet.css';

function pinIcon(color: string) {
  return L.divIcon({
    className: 'map-pin-icon',
    html: `<div class="map-pin-icon__shape" style="background:${color}"></div>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
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

function ZoomFix() {
  const map = useMap();
  useEffect(() => {
    const onZoomEnd = () => {
      map.invalidateSize({ pan: false });
    };
    map.on('zoomend', onZoomEnd);
    return () => {
      map.off('zoomend', onZoomEnd);
    };
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
      <MapContainer
        center={UCSD}
        zoom={16}
        zoomControl={false}
        attributionControl
        preferCanvas
        className="map-leaflet"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
          updateWhenZooming={false}
          updateWhenIdle
          keepBuffer={4}
        />
        <Resize />
        <ZoomFix />
        {list.map((p: EventPin) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(PIN_HEX[p.color])}>
            <Popup>
              <div className="map-popup">
                <strong>{p.title}</strong>
                {p.club && <div className="map-popup__club">{p.club}</div>}
                {onSave && (
                  <button type="button" className="map-popup__save" onClick={() => onSave(p.id)}>
                    {saved?.has(p.id) ? 'Saved ✓' : 'Save event'}
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
