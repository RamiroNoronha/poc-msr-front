export type AnalysisStatus = 'queued' | 'processing' | 'completed' | 'failed'
export type AnalysisState = { id: string | null; status: AnalysisStatus | null }
export const initialAnalysisState: AnalysisState = { id: null, status: null }
