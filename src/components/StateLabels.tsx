import { divIcon } from 'leaflet';
import { Marker } from 'react-leaflet';
import centroid from '@turf/centroid';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { BrazilStatesFeatureCollection } from '../types/geo';

export function StateLabels({ states }: { states: BrazilStatesFeatureCollection }) {
  return (
    <>
      {states.features.map((feature) => {
        const c = centroid(feature as Feature<Polygon | MultiPolygon>);
        const [lng, lat] = c.geometry.coordinates;
        const uf = feature.properties.sigla;
        const icon = divIcon({
          className: 'uf-label-icon',
          html: `<span>${uf}</span>`,
          iconSize: [20, 16],
          iconAnchor: [10, 8],
        });

        return <Marker key={uf} position={[lat, lng]} icon={icon} interactive={false} />;
      })}
    </>
  );
}
