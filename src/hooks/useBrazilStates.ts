import { useEffect, useMemo, useState } from 'react';
import type { BrazilStateProperties, BrazilStatesFeatureCollection } from '../types/geo';

type UseBrazilStatesResult = {
  data: BrazilStatesFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
};

const LOCAL_GEOJSON_PATH = `${import.meta.env.BASE_URL}data/brazil-states.geojson`;

function normalizeProperties(props: Record<string, unknown>): BrazilStateProperties {
  const uf = String(props.uf ?? props.sigla ?? props.SIGLA_UF ?? props.CD_UF ?? '').toUpperCase();
  const name = String(props.name ?? props.nome ?? props.NM_UF ?? '').trim();

  return {
    sigla: uf as BrazilStateProperties['sigla'],
    nome: name,
  };
}

function normalizeGeoJson(input: unknown): BrazilStatesFeatureCollection {
  const featureCollection = input as GeoJSON.FeatureCollection;

  if (featureCollection.type !== 'FeatureCollection' || !Array.isArray(featureCollection.features)) {
    throw new Error('GeoJSON inválido para estados brasileiros.');
  }

  const features = featureCollection.features.map((feature) => {
    const normalized = normalizeProperties((feature.properties ?? {}) as Record<string, unknown>);

    if (!normalized.sigla || !normalized.nome) {
      throw new Error('Feature sem propriedades mínimas de UF e nome.');
    }

    return {
      ...feature,
      properties: normalized,
    };
  });

  return {
    type: 'FeatureCollection',
    features,
  } as BrazilStatesFeatureCollection;
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
        const response = await fetch(LOCAL_GEOJSON_PATH);

        if (!response.ok) {
          throw new Error('Não foi possível carregar public/data/brazil-states.geojson');
        }

        const rawGeojson = await response.json();
        const normalizedGeojson = normalizeGeoJson(rawGeojson);

        if (isMounted) {
          setData(normalizedGeojson);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar public/data/brazil-states.geojson');
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error]);
}
