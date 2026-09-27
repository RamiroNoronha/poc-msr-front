export type StoreListener<State> = (state: State) => void
export function createStore<State>(initialState: State) {
  let state = initialState
  const listeners = new Set<StoreListener<State>>()
  return {
    getState: () => state,
    setState: (nextState: State) => { state = nextState; listeners.forEach((listener) => listener(state)) },
    subscribe: (listener: StoreListener<State>) => { listeners.add(listener); return () => listeners.delete(listener) },
  }
}
