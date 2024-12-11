import { create, useStore } from 'zustand'

interface LatLng {
    lat: number
    lng: number
}

interface Layer {
    id: string
    name: string
    points: LatLng[]
}

interface MapState {
  layers: Layer[]
  add: (layer: Layer) => void
}

export const mapState = create<MapState>()((set) => ({
  layers: [],
  add: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
}))

// export store functions for Astro components to call
const { getState, getInitialState, subscribe, setState } = mapState
export { getState, getInitialState, subscribe, setState }

/**
 * @see https://docs.pmnd.rs/zustand/guides/typescript#bounded-usestore-hook-for-vanilla-stores
 */
export function useMapState(): MapState
export function useMapState<T>(selector: (state: MapState) => T): T
export function useMapState<T>(selector?: (state: MapState) => T) {
  // biome-ignore lint/style/noNonNullAssertion: zustand provides this example in their docs
  return useStore(mapState, selector!)
}