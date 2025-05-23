import { useContext, useEffect, useRef } from "react";
import { MapContext } from "./MapContext";
import { createTelemetrySocket } from "../api/telemetrySocket";
import maplibregl from "maplibre-gl";

export function TrackLayer() {
  const map = useContext(MapContext);
  const coordsRef = useRef<[number, number][]>([]);
  const markerRef = useRef<maplibregl.Marker | null>(null);

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
    map.addLayer({ id: "track-line", type: "line", source: "track", paint: { "line-color": "#0066ff", "line-width": 3 } });
    markerRef.current = new maplibregl.Marker({ color: "#0066ff" }).setLngLat([71.45, 51.16]).addTo(map);

    // Подписываемся на телеметрию
    const socket = createTelemetrySocket(pt => {
      coordsRef.current.push([pt.lon, pt.lat]);
      const src = map.getSource("track") as maplibregl.GeoJSONSource;
      src.setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: coordsRef.current },
        properties: {},
      });
      markerRef.current!.setLngLat([pt.lon, pt.lat]);
    });

    return () => {
      socket.disconnect();
    };
  }, [map]);

  return null;
}
