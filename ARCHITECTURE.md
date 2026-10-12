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
      hooks/ locales/ service/ store/ styles/ utils/ views/components/ index.ts
  shared/                      # código sem conhecimento de domínio
    api/ components/ hooks/ i18n/ locales/ store/ styles/ utils/
```

## Regras

- Uma feature não importa arquivos internos de outra feature. A composição de telas fica em `app/`.
- Exceção: uma feature de composição (hoje, `analysis-dashboard`) pode importar outras features **somente pela porta pública**, o `index.ts` delas (ex.: `import { HotspotSection } from '../../hotspot'`). Cada feature decide o que expõe nesse arquivo; nunca se importa `views/`, `utils/` etc. de outra feature.
- Componentes usados somente por uma feature ficam em `views/components` dela.
- `shared` não conhece análise, repositório, GitHub, Truck Factor, hotspot ou regras de negócio. Componentes genéricos (como `ZoomableCirclePack`) recebem dados e comportamento por props.
- Estado local permanece na feature; `shared/store` contém apenas primitivas reutilizáveis.
- O cliente HTTP é compartilhado (`shared/api/apiClient.ts`); as chamadas específicas do domínio ficam na feature correspondente, na pasta `service/` (só nas features que falam com a API).
- Estilos são implementados com Emotion. Os componentes estilizados (`styled`) não ficam no arquivo da view ou do componente: cada um tem o seu `<Componente>.styled.ts` na pasta `styles/` da feature (ex.: `features/coupling/styles/CouplingGraph.styled.ts`); o componente apenas importa o que usa. Para os componentes de `shared/components`, os arquivos ficam em `shared/styles`, junto dos estilos globais (`GlobalStyles`) e de trechos reutilizáveis (`expandable`).
- Valores usados só pelos estilos (como uma constante de tamanho de fonte) ficam no `.styled.ts` e são exportados dali, se o componente também precisar deles.

## Dados e API (`service/` + TanStack Query)

Cada feature que consome a API tem uma pasta `service/` com três partes:

- `<Feature>Repository` (classe): só chama a API (`apiClient`) e devolve o corpo da resposta. Não valida nem transforma nada.
- `<Feature>Manager` (classe): recebe o Repository e faz as operações em cima do resultado (validar a entrada, converter para o modelo da tela, filtrar...). Quando não há o que fazer, apenas repassa a chamada.
- `contracts.ts`: tipos dos dados (e constantes ligadas a eles). `index.ts` cria e exporta a instância do Manager (ex.: `couplingManager`).

Os hooks da feature (`hooks/`) usam o TanStack Query e conversam **só com o Manager**, nunca com o Repository nem com o `apiClient`:

- `useQuery`/`useQueries` para leituras (ex.: `useCoupling`, `useAnalyzeRepository`, que roda três consultas em paralelo e só começa depois do submit).
- `useMutation` para ações do usuário cujo resultado decide o próximo passo (ex.: `useDevelopersReview`).
- Os `queryKey`s incluem todos os parâmetros da chamada; o `QueryClient` (`app/queryClient.ts`) define `retry: false`, `refetchOnWindowFocus: false` e `staleTime` de 5 minutos.
- Os hooks devolvem ao restante da feature dados e mensagens de erro já traduzidas; as views não conhecem o TanStack Query.
- Repository e Manager são classes (sem estado de React), recebem o `AbortSignal` do TanStack Query e não importam hooks.

## Textos (i18n)

- Nenhum texto de interface fica no código: rótulos, mensagens, placeholders, `aria-label`, `title` e mensagens de erro vêm de traduções (`i18next` + `react-i18next`).
- Cada feature é dona do seu namespace em `features/<feature>/locales/<idioma>.ts` (ex.: `pt-BR.ts`); os textos comuns ficam em `shared/locales` (namespace `common`). Os namespaces são registrados em `app/i18n.ts`, que também define o idioma padrão.
- Nos componentes use `const { t } = useTranslation('<namespace>')`; fora de componentes (hooks, utilitários), `i18n.t(chave, { ns })` ou `i18n.getFixedT(null, '<namespace>')`. Frases com marcação usam `<Trans>`.
- As chaves são tipadas (`src/i18next.d.ts`): chave inexistente falha no build. Prefira chaves por contexto (`section.title`, `controls.period.label`) a chaves por texto.
- Singular/plural usam os sufixos `_one`, `_other` e, quando preciso, `_zero`, com `count` (ex.: `units.lines`). Números e porcentagens seguem o idioma ativo: `{{count, number}}` nas traduções e `formatNumber`/`formatPercent` (`shared/i18n/format`) no código.
- Códigos vindos do backend (ex.: motivos de agrupamento) são traduzidos no front; a mensagem `detail` de erro do backend é exibida como veio.
- Para adicionar um idioma, crie o mesmo arquivo em cada `locales/` e registre-o em `resources` (`app/i18n.ts`).

## Ambiente e API

- Copie `.env.example` para `.env` para configurar `VITE_API_BASE_URL` localmente. O `.env` não é versionado.
- `shared/api/apiClient.ts` concentra a instância Axios. Cada feature expõe suas próprias chamadas e contratos em `api/`.
