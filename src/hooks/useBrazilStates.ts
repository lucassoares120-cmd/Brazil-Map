import { useEffect, useMemo, useState } from 'react';
import type { BrazilStateProperties, BrazilStatesFeatureCollection } from '../types/geo';

type UseBrazilStatesResult = {
  data: BrazilStatesFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
};

const LOCAL_GEOJSON_PATH = `${import.meta.env.BASE_URL}data/brazil-states.geojson`;

function normalizeProperties(props: Record<string, unknown>): { uf: string; name: string } {
  const uf = String(props.uf ?? props.sigla ?? props.SIGLA_UF ?? props.CD_UF ?? '').toUpperCase();
  const name = String(props.name ?? props.nome ?? props.NM_UF ?? '').trim();
  return { uf, name };
}


function isAxisAlignedRectangle(feature: GeoJSON.Feature): boolean {
  if (feature.geometry?.type !== 'Polygon') return false;
  const ring = feature.geometry.coordinates?.[0];
  if (!Array.isArray(ring) || ring.length !== 5) return false;
  const lngs = new Set(ring.map((c) => Number(c[0]).toFixed(6)));
  const lats = new Set(ring.map((c) => Number(c[1]).toFixed(6)));
  return lngs.size === 2 && lats.size === 2;
}

function validateFeatureCollection(features: GeoJSON.Feature[]): void {
  if (features.length !== 27) {
    throw new Error(`GeoJSON inválido: esperado 27 estados, recebido ${features.length}.`);
  }

  const invalidGeometry = features.find((feature) => {
    const type = feature.geometry?.type;
    return type !== 'Polygon' && type !== 'MultiPolygon';
  });

  if (invalidGeometry) {
    throw new Error('GeoJSON inválido: todas as geometrias devem ser Polygon ou MultiPolygon.');
  }

  const invalidUf = features.find((feature) => {
    const props = normalizeProperties((feature.properties ?? {}) as Record<string, unknown>);
    return !props.uf;
  });

  if (invalidUf) {
    throw new Error('GeoJSON inválido: todas as features devem possuir UF.');
  }

  const artificialRectangles = features.filter(isAxisAlignedRectangle);
  if (artificialRectangles.length > 0) {
    throw new Error('GeoJSON inválido: foram detectadas geometrias retangulares artificiais. Substitua public/data/brazil-states.geojson por uma malha oficial real das UFs.');
  }
}

function normalizeGeoJson(input: unknown): BrazilStatesFeatureCollection {
  const featureCollection = input as GeoJSON.FeatureCollection;

  if (featureCollection.type !== 'FeatureCollection' || !Array.isArray(featureCollection.features)) {
    throw new Error('GeoJSON inválido para estados brasileiros.');
  }

  validateFeatureCollection(featureCollection.features);

  const features = featureCollection.features.map((feature) => {
    const normalized = normalizeProperties((feature.properties ?? {}) as Record<string, unknown>);
    if (!normalized.uf || !normalized.name) {
      throw new Error('Feature sem propriedades mínimas de UF e nome.');
    }

    return {
      ...feature,
      properties: {
        uf: normalized.uf,
        name: normalized.name,
        sigla: normalized.uf,
        nome: normalized.name,
      } as BrazilStateProperties,
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
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar public/data/brazil-states.geojson';
        console.error('[useBrazilStates]', message);
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
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
