import { useEffect, useMemo, useState } from 'react';
import type { BrazilStateFeature, BrazilStatesFeatureCollection, UF } from '../types/geo';

type UseBrazilStatesResult = {
  data: BrazilStatesFeatureCollection | null;
  isLoading: boolean;
  error: string | null;
};

const LOCAL_GEOJSON_PATH = `${import.meta.env.BASE_URL}data/brazil-states.geojson`;

const IBGE_CODE_TO_STATE: Record<string, { uf: UF; name: string }> = {
  '11': { uf: 'RO', name: 'Rondônia' },
  '12': { uf: 'AC', name: 'Acre' },
  '13': { uf: 'AM', name: 'Amazonas' },
  '14': { uf: 'RR', name: 'Roraima' },
  '15': { uf: 'PA', name: 'Pará' },
  '16': { uf: 'AP', name: 'Amapá' },
  '17': { uf: 'TO', name: 'Tocantins' },
  '21': { uf: 'MA', name: 'Maranhão' },
  '22': { uf: 'PI', name: 'Piauí' },
  '23': { uf: 'CE', name: 'Ceará' },
  '24': { uf: 'RN', name: 'Rio Grande do Norte' },
  '25': { uf: 'PB', name: 'Paraíba' },
  '26': { uf: 'PE', name: 'Pernambuco' },
  '27': { uf: 'AL', name: 'Alagoas' },
  '28': { uf: 'SE', name: 'Sergipe' },
  '29': { uf: 'BA', name: 'Bahia' },
  '31': { uf: 'MG', name: 'Minas Gerais' },
  '32': { uf: 'ES', name: 'Espírito Santo' },
  '33': { uf: 'RJ', name: 'Rio de Janeiro' },
  '35': { uf: 'SP', name: 'São Paulo' },
  '41': { uf: 'PR', name: 'Paraná' },
  '42': { uf: 'SC', name: 'Santa Catarina' },
  '43': { uf: 'RS', name: 'Rio Grande do Sul' },
  '50': { uf: 'MS', name: 'Mato Grosso do Sul' },
  '51': { uf: 'MT', name: 'Mato Grosso' },
  '52': { uf: 'GO', name: 'Goiás' },
  '53': { uf: 'DF', name: 'Distrito Federal' },
};

function extractIbgeCode(feature: GeoJSON.Feature): string {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const rawCandidates = [props.codarea, props.CD_UF, props.cd_uf, props.id, feature.id];

  for (const value of rawCandidates) {
    if (value == null) continue;
    const text = String(value).trim();
    if (!text) continue;

    const onlyDigits = text.replace(/\D/g, '');
    if (onlyDigits.length >= 2) {
      const firstTwo = onlyDigits.slice(0, 2);
      if (IBGE_CODE_TO_STATE[firstTwo]) return firstTwo;
    }
  }

  return '';
}

function isAxisAlignedRectangle(feature: GeoJSON.Feature): boolean {
  if (feature.geometry?.type !== 'Polygon') return false;
  const ring = feature.geometry.coordinates?.[0];
  if (!Array.isArray(ring) || ring.length !== 5) return false;
  const lngs = new Set(ring.map((c) => Number(c[0]).toFixed(6)));
  const lats = new Set(ring.map((c) => Number(c[1]).toFixed(6)));
  return lngs.size === 2 && lats.size === 2;
}

function normalizeStateFeature(feature: GeoJSON.Feature): BrazilStateFeature {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const ibgeCode = extractIbgeCode(feature);
  const mapped = IBGE_CODE_TO_STATE[ibgeCode];

  const uf = String(props.uf ?? props.UF ?? props.sigla ?? mapped?.uf ?? '').toUpperCase() as UF;
  const name = String(props.name ?? props.nome ?? props.NM_UF ?? mapped?.name ?? '').trim();

  return {
    ...feature,
    properties: {
      ...props,
      uf,
      UF: uf,
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

  const rectangleCount = collection.features.filter(isAxisAlignedRectangle).length;
  if (rectangleCount === 27) {
    throw new Error('GeoJSON inválido: todas as geometrias parecem retângulos artificiais.');
  }
}

function normalizeGeoJson(input: unknown): BrazilStatesFeatureCollection {
  const collection = input as GeoJSON.FeatureCollection;
  validateFeatureCollection(collection);

  const features = collection.features.map(normalizeStateFeature);

  const invalidProps = features.find((feature) => !feature.properties.uf || !feature.properties.name || !feature.properties.ibgeCode);
  if (invalidProps) {
    throw new Error('GeoJSON inválido: não foi possível normalizar uf/name/ibgeCode para todas as features.');
  }

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
