import { useMapState } from '@/store/state'


export default function LayerList(): JSX.Element {
    const layers = useMapState((state) => state.layers);
    return (
        <div>
            <p className="text-xs text-stone-400">Layers</p>
            {layers.map((layer) =>
                <div key={layer.id} >
                    <button className="text-red-400 text-xs hover:text-white hover:bg-red-400">X</button>
                    <span className="text-sm text-stone-700"> {layer.name} </span>
                    <span className="text-xs text-stone-400">&middot; {layer.points.length} points</span>
                </div>
            )}
        </div>
    )
}
