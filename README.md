# Brazil Map (Planejamento + implementação incremental)

## Etapa 1 — Planejamento técnico
Planejamento arquitetural e geoespacial definido com separação por componentes/hooks/utils, coordenadas em EPSG:4326, cálculo geodésico e persistência local.

## Etapa 2 — Setup do projeto
Scaffold React + TypeScript + Vite concluído.

## Etapa 3 — Mapa base do Brasil (concluída)
Implementações entregues:
- Mapa interativo com zoom/pan usando Leaflet.
- Base map OpenStreetMap.
- Carregamento da malha oficial dos estados brasileiros via API de malhas do IBGE em GeoJSON.
- Renderização de cada estado como polígono individual, com identificação por UF (`sigla`) e nome.
- Cor padrão aplicada aos estados com suporte a sobreposição de cor customizada por UF.
- Interação de clique para seleção de estado e tooltip com nome/sigla.

### Fonte geográfica dos estados
- Endpoint IBGE usado no frontend:
  - `https://servicodados.ibge.gov.br/api/v3/malhas/estados?formato=application/vnd.geo+json`

## Próximas etapas já preparadas
- **Etapa 3.1:** siglas no centro visual dos estados (centroides com Turf + ajustes manuais quando necessário).
- **Etapa 3.2:** painel completo de customização de cores por estado + persistência em localStorage.
- **Etapas 4+**: dados de cidades (base inicial real), criação e gestão de rotas, persistência e polimento UX.

## Como rodar localmente
1. `npm install`
2. `npm run dev`

> Observação: neste ambiente de execução, o acesso ao registry npm retorna HTTP 403; por isso não foi possível instalar dependências e validar runtime aqui. Em ambiente local padrão, o projeto roda normalmente.
