import { getApiBaseUrl } from '../utils/getApiBaseUrl'
export async function getJson<Response>(path: string): Promise<Response> {
  const response = await fetch(`${getApiBaseUrl()}${path}`)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return response.json() as Promise<Response>
}
