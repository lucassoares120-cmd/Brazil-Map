import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBrazilStates } from '../hooks/useBrazilStates';
import { useStateColors } from '../hooks/useStateColors';
import { StateLayer } from './StateLayer';
import type { BrazilStatesFeatureCollection, UF } from '../types/geo';

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253];

function FitToStatesBounds({ states }: { states: BrazilStatesFeatureCollection }) {
  const map = useMap();
  const layer = new LeafletGeoJSON(states);
  map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  return null;
}

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
          <>
            <FitToStatesBounds states={data} />
            <StateLayer
              states={data}
              selectedUf={selectedUf}
              onSelectUf={setSelectedUf}
              getStateColor={getStateColor}
            />
          </>
        ) : null}
      </MapContainer>
    </main>
  );
}
