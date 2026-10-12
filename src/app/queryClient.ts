import { QueryClient } from '@tanstack/react-query'

const FIVE_MINUTES = 5 * 60_000

// Sem novas tentativas automáticas (um 404 do GitHub não muda ao repetir) e sem refetch ao focar a janela;
// repetir a mesma análise dentro de 5 minutos reaproveita o cache do navegador.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: FIVE_MINUTES },
  },
})
