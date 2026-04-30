import { useEffect, useMemo, useState } from 'react';
import type { BrazilStateFeature, BrazilStatesFeatureCollection, UF } from '../types/geo';

type UseBrazilStatesResult = {
  data: BrazilStatesFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
};

const LOCAL_GEOJSON_PATH = `${import.meta.env.BASE_URL}data/brazil-states.geojson`;

const UF_TO_IBGE: Record<UF, string> = {
  RO: '11', AC: '12', AM: '13', RR: '14', PA: '15', AP: '16', TO: '17',
  MA: '21', PI: '22', CE: '23', RN: '24', PB: '25', PE: '26', AL: '27', SE: '28', BA: '29',
  MG: '31', ES: '32', RJ: '33', SP: '35', PR: '41', SC: '42', RS: '43', MS: '50', MT: '51', GO: '52', DF: '53',
};

function normalizeStateFeature(feature: GeoJSON.Feature): BrazilStateFeature {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const uf = String(props.uf ?? props.sigla ?? props.SIGLA_UF ?? '').toUpperCase() as UF;
  const name = String(props.name ?? props.nome ?? props.NM_UF ?? '').trim();
  const ibgeCode = String(props.ibgeCode ?? props.CD_UF ?? UF_TO_IBGE[uf] ?? '').trim();

  return {
    ...feature,
    properties: {
      uf,
      name,
      ibgeCode,
      sigla: uf,
      nome: name,
    },
  } as BrazilStateFeature;
}

function validateFeatureCollection(collection: GeoJSON.FeatureCollection): void {
  if (collection.type !== 'FeatureCollection') throw new Error('GeoJSON inválido: type deve ser FeatureCollection.');
  if (!Array.isArray(collection.features) || collection.features.length !== 27) {
    throw new Error('GeoJSON inválido: esperado 27 features (UFs).');
  }

  const invalidGeometry = collection.features.find((feature) => {
    const type = feature.geometry?.type;
    return type !== 'Polygon' && type !== 'MultiPolygon';
  });
  if (invalidGeometry) throw new Error('GeoJSON inválido: geometria deve ser Polygon ou MultiPolygon.');
}

function normalizeGeoJson(input: unknown): BrazilStatesFeatureCollection {
  const collection = input as GeoJSON.FeatureCollection;
  validateFeatureCollection(collection);

  const features = collection.features.map(normalizeStateFeature);
  const invalidProps = features.find((feature) => !feature.properties.uf || !feature.properties.name || !feature.properties.ibgeCode);
  if (invalidProps) throw new Error('GeoJSON inválido: todas as features devem conter properties.uf, properties.name e properties.ibgeCode.');

  return { type: 'FeatureCollection', features } as BrazilStatesFeatureCollection;
}

export function useBrazilStates(): UseBrazilStatesResult {
  const [data, setData] = useState<BrazilStatesFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetch(LOCAL_GEOJSON_PATH, { cache: 'no-store' });
        if (!response.ok) throw new Error('Não foi possível carregar public/data/brazil-states.geojson');

        const raw = await response.json();
        const normalized = normalizeGeoJson(raw);
        if (isMounted) {
          setData(normalized);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar public/data/brazil-states.geojson';
        console.error('[useBrazilStates]', message);
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error]);
}
