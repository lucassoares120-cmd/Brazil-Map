# Brazil Map

Projeto React + TypeScript + Vite para mapa interativo do Brasil.

## Executar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode em modo desenvolvimento:
   ```bash
   npm run dev
   ```
3. Gere build de produção:
   ```bash
   npm run build
   ```
4. Visualize o build localmente:
   ```bash
   npm run preview
   ```

## Publicação com GitHub Pages (somente GitHub Actions)

Este repositório está configurado para deploy exclusivo no GitHub Pages usando workflow em `.github/workflows/deploy.yml`.

### Pré-requisitos no GitHub

1. A branch de publicação deve ser `main`.
2. Em **Settings → Pages**, selecione **Build and deployment: GitHub Actions**.

### Como publicar

1. Faça commit das alterações.
2. Envie para `main`:
   ```bash
   git push origin main
   ```
3. O workflow **Deploy to GitHub Pages** irá:
   - rodar `npm ci`;
   - rodar `npm run build`;
   - publicar a pasta `dist` no GitHub Pages.

Também é possível publicar manualmente via aba **Actions** com `workflow_dispatch`.

## URL final esperada

- https://lucassoares120-cmd.github.io/Brazil-Map/

## Configuração Vite para Pages

O arquivo `vite.config.ts` usa:

```ts
base: '/Brazil-Map/'
```

Isso garante que os assets sejam resolvidos corretamente no subpath do GitHub Pages.
