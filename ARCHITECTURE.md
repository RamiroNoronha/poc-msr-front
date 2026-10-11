# Arquitetura do front-end

O código de produto é organizado por feature. Cada feature é dona de seus hooks, views, componentes específicos, utilitários e estado.

```text
src/
  app/                         # composição da aplicação (telas e fluxo entre elas)
  features/
    analyze-repository/        # tela inicial: URL do repositório e resumo
    review-developers/         # revisão das identidades de desenvolvedores
    analysis-dashboard/        # tela de resultados: monta as seções de análise
    truck-factor/              # seção Truck Factor (círculos por desenvolvedor, silos)
    hotspot/                   # seção Hotspots (círculos do branco ao vermelho)
      api/ hooks/ store/ utils/ views/components/ index.ts
  shared/                      # código sem conhecimento de domínio
    api/ components/ hooks/ store/ styles/ utils/
```

## Regras

- Uma feature não importa arquivos internos de outra feature. A composição de telas fica em `app/`.
- Exceção: uma feature de composição (hoje, `analysis-dashboard`) pode importar outras features **somente pela porta pública**, o `index.ts` delas (ex.: `import { HotspotSection } from '../../hotspot'`). Cada feature decide o que expõe nesse arquivo; nunca se importa `views/`, `utils/` etc. de outra feature.
- Componentes usados somente por uma feature ficam em `views/components` dela.
- `shared` não conhece análise, repositório, GitHub, Truck Factor, hotspot ou regras de negócio. Componentes genéricos (como `ZoomableCirclePack`) recebem dados e comportamento por props.
- Estado local permanece na feature; `shared/store` contém apenas primitivas reutilizáveis.
- O cliente HTTP é compartilhado; chamadas específicas do domínio ficam na feature correspondente.
- Estilos são implementados com Emotion. Estilos globais ficam em `shared/styles`; estilos de uma tela ou componente ficam no próprio arquivo da feature.

## Ambiente e API

- Copie `.env.example` para `.env` para configurar `VITE_API_BASE_URL` localmente. O `.env` não é versionado.
- `shared/api/apiClient.ts` concentra a instância Axios. Cada feature expõe suas próprias chamadas e contratos em `api/`.
