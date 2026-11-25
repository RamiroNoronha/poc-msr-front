import axios from 'axios'

// A primeira análise de um repositório grande clona e minera todo o histórico e pode levar vários minutos.
const DEFAULT_TIMEOUT_MS = 15 * 60_000

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
})
