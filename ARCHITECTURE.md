# Arquitetura do front-end

O código de produto é organizado por feature. Cada feature é dona de seus hooks, views, componentes específicos, utilitários e estado.

```text
src/
  app/                         # composição da aplicação
  features/
    analyze-repository/
      hooks/ store/ utils/ views/components/
    analysis-dashboard/
      hooks/ store/ utils/ views/components/
  shared/                      # código sem conhecimento de domínio
    api/ components/ hooks/ store/ styles/ utils/
```

## Regras

- Uma feature não importa arquivos internos de outra feature; a composição fica em `app/`.
- Componentes usados somente por uma feature ficam em `views/components` dela.
- `shared` não conhece análise, repositório, GitHub, Truck Factor ou regras de negócio.
- Estado local permanece na feature; `shared/store` contém apenas primitivas reutilizáveis.
- O cliente HTTP é compartilhado; chamadas específicas do domínio ficam na feature correspondente.
- Estilos são implementados com Emotion. Estilos globais ficam em `shared/styles`; estilos de uma tela ou componente ficam no próprio arquivo da feature.

## Ambiente e API

- Copie `.env.example` para `.env` para configurar `VITE_API_BASE_URL` localmente. O `.env` não é versionado.
- `shared/api/apiClient.ts` concentra a instância Axios. Cada feature expõe suas próprias chamadas e contratos em `api/`.
