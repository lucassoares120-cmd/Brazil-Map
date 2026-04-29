import { useEffect, useMemo, useState } from 'react';
import type { BrazilStatesFeatureCollection } from '../types/geo';

type UseBrazilStatesResult = {
  data: BrazilStatesFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
};

const IBGE_STATES_GEOJSON_URL =
  'https://servicodados.ibge.gov.br/api/v3/malhas/estados?formato=application/vnd.geo+json';

export function useBrazilStates(): UseBrazilStatesResult {
  const [data, setData] = useState<BrazilStatesFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetch(IBGE_STATES_GEOJSON_URL);
        if (!response.ok) {
          throw new Error(`Falha ao carregar malha dos estados (HTTP ${response.status}).`);
        }
        const geojson = (await response.json()) as BrazilStatesFeatureCollection;
        if (isMounted) {
          setData(geojson);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro inesperado ao carregar os estados.');
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
