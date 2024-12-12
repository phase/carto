import { getState, useMapState, type Layer } from '@/store/state'

function removeLayer(id: string) {
    const map = document.getElementsByTagName("leaflet-map")[0].map;
    if (map === undefined) {
        return;
    }

    const layer = map._layers[id];
    if (layer === undefined) {
        return;
    }

    map.removeLayer(layer);
    getState().remove(id);
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
            <p className="text-xs text-stone-400">LAYERS</p>
            {Array.from(layers.entries()).filter(([id, layer]) => layer.parent === undefined).map(([id, layer]) =>
                <div key={id} className="px-2">
                    <button className="py-auto text-red-400 hover:text-white hover:bg-red-400"
                     style={{fontSize: "0.6rem"}}
                     onClick={() => removeLayer(id)}>X</button>
                    <span className="text-xs text-stone-700 pl-2">{layer.name} </span>
                    {layer.data.kind === "Polygon" &&
                        <span className="text-xs text-stone-400">({layer.data.points.length})</span>
                    || layer.data.kind === "Image" &&
                        <span>
                            <button className="text-xs text-stone-400 hover:bg-stone-700" onClick={() => toggleFrozen(layer)}>{layer.data.frozen ? "🔒" : "✏️"}</button>
                            <br/>
                            <span className="text-xs text-stone-400"> {layer.data.url}</span>
                        </span>
                    || layer.data.kind === "Group" &&
                        <div className="pl-2">
                            {Array.from(layer.data.children.entries()).map(([key, child]) => {
                                if (layers.get(child) === undefined) {
                                    return <></>;
                                } else {
                                    return <span key={key}>
                                        <button className="py-auto text-red-400 hover:text-white hover:bg-red-400"
                                            style={{fontSize: "0.5rem"}}
                                            onClick={() => removeLayer(child)}>X</button>
                                        <span style={{fontSize: "0.7rem"}} className="pl-2 text-stone-600">{layers.get(child)!.name}</span>
                                        <br/>
                                    </span>
                                }
                            })}
                        </div>
                    ||
                        <span className="text-xs text-stone-400">?</span>
                    }
                </div>
            )}
        </div>
    )
}
