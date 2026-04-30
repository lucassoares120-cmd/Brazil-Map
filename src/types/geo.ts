export type UF =
  | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MT' | 'MS'
  | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC'
  | 'SP' | 'SE' | 'TO';

export type StateColorConfig = {
  defaultColor: string;
  customColors: Partial<Record<UF, string>>;
};

export type BrazilStateProperties = {
  uf: UF;
  name: string;
  ibgeCode: string;
  sigla: UF;
  nome: string;
};

export type BrazilStateFeature = GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon, BrazilStateProperties>;

export type BrazilStatesFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  BrazilStateProperties
>;
