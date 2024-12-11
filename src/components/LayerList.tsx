import { useMapState } from '@/store/state'


export default function LayerList(): JSX.Element {
    const layers = useMapState((state) => state.layers);
    return (
        <div>
            <p className="text-xs text-stone-400">Layers</p>
            {Array.from(layers.entries()).map(([id, layer]) =>
                <div key={id} className="p-1">
                    <button className="text-red-400 text-xs hover:text-white hover:bg-red-400">X</button>
                    <span className="text-sm text-stone-700"> {layer.name} </span>
                    {layer.data.kind === "Polygon" &&
                        <span className="text-xs text-stone-400">({layer.data.points.length})</span>
                    || layer.data.kind === "Image" &&
                        <span className="text-xs text-stone-400">{layer.data.url}</span>
                    ||
                        <span className="text-xs text-stone-400">?</span>
                    }
                </div>
            )}
        </div>
    )
}
