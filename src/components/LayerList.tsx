import { getState, useMapState, type Layer } from '@/store/state'


function removeLayer(id: string) {
    console.log("remove layer", id);
}

function toggleFrozen(layer: Layer) {
    getState().replace(layer.id, {
        ...layer,
        data: {
            ...layer.data,
            kind: "Image",
            frozen: !layer.data.frozen,
        }
    })
}

export default function LayerList(): JSX.Element {
    const layers = useMapState((state) => state.layers);
    return (
        <div>
            <p className="text-xs text-stone-400">Layers</p>
            {Array.from(layers.entries()).map(([id, layer]) =>
                <div key={id} className="p-1">
                    <button className="text-red-400 text-xs hover:text-white hover:bg-red-400" onClick={() => removeLayer(id)}>X</button>
                    <span className="text-sm text-stone-700"> {layer.name} </span>
                    {layer.data.kind === "Polygon" &&
                        <span className="text-xs text-stone-400">({layer.data.points.length})</span>
                    || layer.data.kind === "Image" &&
                        <span>
                            <button className="text-xs text-stone-400 hover:bg-stone-700" onClick={() => toggleFrozen(layer)}>{layer.data.frozen ? "🥶" : "🥵"}</button>
                            <br/>
                            <span className="text-xs text-stone-400"> {layer.data.url}</span>
                        </span>
                    ||
                        <span className="text-xs text-stone-400">?</span>
                    }
                </div>
            )}
        </div>
    )
}