import { create, useStore } from 'zustand'

interface LatLng {
    lat: number
    lng: number
}

interface PolygonLayer {
    kind: "Polygon"
    points: LatLng[]
}

interface ImageLayer {
    kind: "Image"
    url: string
}

interface UnknownLayer {
    kind: "Uknown"
}

export type LayerData = PolygonLayer | ImageLayer | UnknownLayer

interface Layer {
    id: string
    name: string
    data: LayerData
}

interface MapState {
  layers: Map<string, Layer>
  add: (layer: Layer) => void
  replace: (id: string, layer: Layer) => void
}

export const mapState = create<MapState>()((set) => ({
  layers: new Map(),
  add: (layer) => set((state) => ({ layers: new Map([...state.layers, [layer.id, layer]]) })),
  replace: (id, layer) => set((state) => ({ layers: new Map([...state.layers, [id, layer]]) })),
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