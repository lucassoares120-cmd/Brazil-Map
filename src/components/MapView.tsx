import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBrazilStates } from '../hooks/useBrazilStates';
import { useStateColors } from '../hooks/useStateColors';
import { StateLayer } from './StateLayer';
import type { UF } from '../types/geo';
import { useState } from 'react';

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253];

export function MapView() {
  const { data, isLoading, error } = useBrazilStates();
  const { getStateColor } = useStateColors();
  const [selectedUf, setSelectedUf] = useState<UF | null>(null);

  return (
    <main className="map-view">
      {isLoading && <div className="map-overlay">Carregando estados do Brasil...</div>}
      {error && <div className="map-overlay error">{error}</div>}
      <MapContainer center={BRAZIL_CENTER} zoom={4} minZoom={3} maxZoom={12} className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data ? (
          <StateLayer
            states={data}
            selectedUf={selectedUf}
            onSelectUf={setSelectedUf}
            getStateColor={getStateColor}
          />
        ) : null}
      </MapContainer>
    </main>
  );
}
