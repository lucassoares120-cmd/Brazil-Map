import { divIcon } from 'leaflet';
import { Marker } from 'react-leaflet';
import centerOfMass from '@turf/center-of-mass';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { BrazilStatesFeatureCollection } from '../types/geo';

function getStateLabelPosition(feature: Feature<Polygon | MultiPolygon>): [number, number] {
  const center = centerOfMass(feature);
  const [lng, lat] = center.geometry.coordinates;
  return [lat, lng];
}

export function StateLabels({ states }: { states: BrazilStatesFeatureCollection }) {
  return (
    <>
      {states.features.map((feature) => {
        const position = getStateLabelPosition(feature as Feature<Polygon | MultiPolygon>);
        const uf = feature.properties.uf;
        const icon = divIcon({
          className: 'uf-label-icon',
          html: `<span>${uf}</span>`,
          iconSize: [20, 16],
          iconAnchor: [10, 8],
        });

        return <Marker key={uf} position={position} icon={icon} interactive={false} />;
      })}
    </>
  );
}
