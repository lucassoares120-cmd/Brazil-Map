# Brazil Map (Planejamento + Setup inicial)

## Etapa 1 — Planejamento técnico

### Arquitetura proposta
- **Frontend SPA em React + TypeScript** com separação por camadas:
  - `components/`: apresentação e interação visual.
  - `hooks/`: estado e regras de negócio.
  - `utils/`: cálculos geoespaciais, validações e helpers.
  - `data/`: catálogos estáticos (cidades iniciais, metadados de estados).
  - `types/`: contratos tipados de cidades, rotas e estados.
- O estado de UI (seleções e destaque) ficará local ao componente/hook.
- O estado persistente (rotas e cores de estados) será gerido por hooks + `localStorage`.

### Bibliotecas escolhidas
- **React + TypeScript + Vite**: produtividade e manutenção.
- **Leaflet + React-Leaflet**: simples, maduro e confiável para renderização vetorial 2D.
- **Turf.js**: distância geodésica, centroides e validação geoespacial.

### Estrutura de pastas (inicial)
- `src/components`
- `src/hooks`
- `src/utils`
- `src/types`
- `src/data`
- `public/data` (GeoJSON e datasets públicos)

### Carregamento de dados geográficos
- GeoJSON dos estados será servido de `public/data/brazil-states.geojson`.
- Dados de cidades iniciarão em JSON/TS local com amostra validada e depois poderão migrar para dataset completo do IBGE.

### Precisão geográfica
- Coordenadas de cidades em **EPSG:4326** (lat/lon reais).
- Distância calculada por Turf (`distance`) em quilômetros (grande-círculo).
- Nada de coordenadas fictícias para cidades importantes.

### Renderização individual de estados
- Cada `Feature` do GeoJSON terá UF e nome.
- A camada vetorial mapeará cada feature com estilo dinâmico por UF.
- Clique/hover por estado via eventos do Leaflet.

### Gerência de cores de estados
- Configuração central:
  - `defaultColor`
  - `customColors: Record<UF, hex>`
- Regra de prioridade: cor individual sobrepõe cor global.

### Camadas visuais
1. Base map
2. Estados (polígonos)
3. Siglas (labels)
4. Rotas
5. Marcadores de cidades
6. Tooltips

### Persistência local
- Chaves separadas no `localStorage`:
  - `brazil-map:routes:v1`
  - `brazil-map:state-colors:v1`
- Com validação e fallback seguro em caso de JSON inválido.

## Etapa 2 — Setup do projeto
Concluída neste commit com scaffold React + TS (manual devido bloqueio de registro npm no ambiente).

## Como rodar localmente
1. `npm install`
2. `npm run dev`

> Observação: neste ambiente de execução, a instalação de pacotes está bloqueada por política externa (403 em registry), mas o projeto está preparado para rodar em ambiente local padrão.
