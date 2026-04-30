import { GeoJSON, Tooltip } from 'react-leaflet';
import type { Layer } from 'leaflet';
import type { BrazilStateFeature, BrazilStatesFeatureCollection, UF } from '../types/geo';

type StateLayerProps = {
  states: BrazilStatesFeatureCollection;
  selectedUf: UF | null;
  onSelectUf: (uf: UF) => void;
  getStateColor: (uf: UF) => string;
};

export function StateLayer({ states, selectedUf, onSelectUf, getStateColor }: StateLayerProps) {
  return (
    <GeoJSON
      data={states}
      style={(feature) => {
        const uf = (feature?.properties as BrazilStateFeature['properties']).sigla;
        const isSelected = uf === selectedUf;
        return {
          color: isSelected ? '#0f172a' : '#334155',
          weight: isSelected ? 2 : 1,
          fillColor: getStateColor(uf),
          fillOpacity: 0.75,
        };
      }}
      onEachFeature={(feature, layer: Layer) => {
        const { sigla, nome } = feature.properties as BrazilStateFeature['properties'];
        layer.bindTooltip(`${nome} (${sigla})`, { sticky: true });
        layer.on('click', () => onSelectUf(sigla));
      }}
    >
      <Tooltip sticky />
    </GeoJSON>
  );
}
