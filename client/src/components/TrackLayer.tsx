import { useContext, useEffect, useRef } from "react";
import { MapContext } from "./MapContext";
import { createTelemetrySocket } from "../api/telemetrySocket";
import maplibregl from "maplibre-gl";

export function TrackLayer() {
  const map = useContext(MapContext);
  const coordsRef = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!map) return;

    // Инициализируем пустой источник и слой
    map.addSource("track", {
      type: "geojson",
      data: {
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: [] },
        properties: {},
      },
    });
    map.addLayer({
      id: "track-line",
      type: "line",
      source: "track",
      paint: { "line-color": "#0066ff", "line-width": 3 },
    });

    // Подписываемся на телеметрию
    const socket = createTelemetrySocket(pt => {
      coordsRef.current.push([pt.lon, pt.lat]);
      const src = map.getSource("track") as maplibregl.GeoJSONSource;
      src.setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: coordsRef.current },
        properties: {},
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [map]);

  return null;
}
