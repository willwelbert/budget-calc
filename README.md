# budget-calc

Calculadora de orçamentos para creators — [added-today](https://willwelbert.github.io/budget-calc/).

**Stack:** Vite · React · TypeScript · Tailwind CSS v4 · shadcn/ui · react-hook-form · Vitest

## Desenvolvimento

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm dev --host   # acessível na rede local (celular)
pnpm test         # vitest em watch mode
pnpm build        # typecheck + build de produção
```

## Deploy

Cada push na `main` roda os testes, faz o build e publica no GitHub Pages
(`.github/workflows/deploy.yml`).
