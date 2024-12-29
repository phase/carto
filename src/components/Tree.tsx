import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import {
  useMapState,
  getState,
  type Layer,
  type LayerData,
} from "../store/state";
import {
  ChevronRight,
  ChevronDown,
  X,
  Lock,
  Edit,
  FileJson,
  Hexagon,
  FileQuestion,
  Image,
} from "lucide-react";

interface TreeProps {
  layer?: Layer;
  depth?: number;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export const Tree: React.FC<TreeProps> = ({ layer, depth = 0 }) => {
  const [isOpen, setOpen] = useState(true);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();
  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 4 : -10,
    },
  });

  const layers = useMapState((state) => state.layers);

  const removeLayer = (id: string) => {
    const map = document.getElementsByTagName("leaflet-map")[0]?.map;
    if (map && map._layers[id]) {
      map.removeLayer(map._layers[id]);
    }
    getState().remove(id);
  };

  const toggleFrozen = (layer: Layer) => {
    if (layer.data.kind === "Image") {
      getState().replace(layer.id, {
        ...layer,
        data: {
          ...layer.data,
          frozen: !layer.data.frozen,
        },
      });
    }
  };
  const exportLayer = (layer: Layer) => {
    if (layer.data.kind === "Polygon") {
      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: layer.name,
            },
            geometry: {
              type: "Polygon",
              coordinates: [layer.data.points.map((p) => [p.lng, p.lat])],
            },
          },
        ],
      };

      const blob = new Blob([JSON.stringify(geojson, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${layer.name}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const renderIcon = (data: LayerData) => {
    switch (data.kind) {
      case "Polygon":
        return <Hexagon className="w-4 h-4 mr-1 text-neutral-200" />;
      case "Image":
        return data.frozen ? (
          <Lock
            className="w-4 h-4 mr-1 cursor-pointer text-neutral-200"
            onClick={() => layer && toggleFrozen(layer)}
          />
        ) : (
          <Edit
            className="w-4 h-4 mr-1 cursor-pointer text-neutral-200"
            onClick={() => layer && toggleFrozen(layer)}
          />
        );
      case "Group":
        return isOpen ? (
          <ChevronDown className="w-4 h-4 mr-1 text-neutral-200" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-1 text-neutral-200" />
        );
      default:
        return null;
    }
  };

  if (!layer) {
    const rootLayers = Array.from(layers.values()).filter((l) => !l.parent);
    return (
      <div>
        {rootLayers.map((rootLayer) => (
          <Tree key={rootLayer.id} layer={rootLayer} />
        ))}
      </div>
    );
  }

  const hasChildren =
    layer.data.kind === "Group" && layer.data.children.length > 0;

  return (
    <div className="mb-1">
      <div className="flex items-center">
        <div
          className={`flex items-center flex-grow ${layer.data.kind === "Group" ? "cursor-pointer" : ""}`}
          onClick={() => hasChildren && setOpen(!isOpen)}
        >
          {renderIcon(layer.data)}
          <span className="text-sm text-neutral-100">{layer.name}</span>
          {layer.data.kind === "Polygon" && (
            <span className="text-xs text-neutral-400 ml-1">
              ({layer.data.points.length})
            </span>
          )}
          {hasChildren && (
            <span className="text-xs text-neutral-400 ml-1">
              ({layer.data.children.length})
            </span>
          )}
        </div>
        <div className="flex items-center">
          {((layer.data.kind === "Polygon" || layer.data.kind === "Group") && (
            <FileJson
              className="w-4 h-4 mr-2 text-neutral-200 hover:text-blue-200 cursor-pointer"
              onClick={() => exportLayer(layer)}
            />
          )) ||
            (layer.data.kind === "Image" && (
              <Image className="w-4 h-4 mr-2 text-neutral-400" />
            )) || <FileQuestion className="w-4 h-4 mr-2 text-stone-400" />}
          <X
            className="w-4 h-4 text-red-400 hover:text-red-600 cursor-pointer"
            onClick={() => removeLayer(layer.id)}
          />
        </div>
      </div>
      {layer.data.kind === "Image" && (
        <div className="pl-6 text-xs text-neutral-200">{layer.data.url}</div>
      )}
      {hasChildren && (
        <animated.div
          style={{
            opacity,
            height: isOpen && previous === isOpen ? "auto" : height,
            transform: y.to((v) => `translate3d(0,${v}px,0)`),
          }}
          className="overflow-hidden"
        >
          <animated.div
            ref={ref}
            className="pl-4 border-l border-dashed border-stone-300"
          >
            {layer.data.kind === "Group" &&
              layer.data.children.map((childId) => {
                const childLayer = layers.get(childId);
                return childLayer ? (
                  <Tree key={childId} layer={childLayer} depth={depth + 1} />
                ) : null;
              })}
          </animated.div>
        </animated.div>
      )}
    </div>
  );
};

export default Tree;
