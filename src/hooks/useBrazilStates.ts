import { useEffect, useMemo, useState } from 'react';
import type { BrazilStatesFeatureCollection } from '../types/geo';

type UseBrazilStatesResult = {
  data: BrazilStatesFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
};

const DATA_SOURCES = [
  '/Brazil-Map/data/brazil-states.geojson',
  '/data/brazil-states.geojson',
  'https://servicodados.ibge.gov.br/api/v3/malhas/estados?formato=application/vnd.geo%2Bjson',
] as const;

export function useBrazilStates(): UseBrazilStatesResult {
  const [data, setData] = useState<BrazilStatesFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      let lastError: string | null = null;

      for (const source of DATA_SOURCES) {
        try {
          const response = await fetch(source);
          if (!response.ok) {
            lastError = `Fonte indisponível (${source}): HTTP ${response.status}`;
            continue;
          }

          const geojson = (await response.json()) as BrazilStatesFeatureCollection;
          if (isMounted) {
            setData(geojson);
            setError(null);
            setIsLoading(false);
          }
          return;
        } catch (err) {
          lastError = err instanceof Error ? err.message : `Erro inesperado em ${source}`;
        }
      }

      if (isMounted) {
        setError(lastError ?? 'Não foi possível carregar a malha dos estados.');
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error]);
}
