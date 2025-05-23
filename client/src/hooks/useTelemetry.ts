    import maplibregl from "maplibre-gl";    
    import { useEffect, useRef } from "react";
    import type { Map } from "maplibre-gl";
    import { createTelemetrySocket } from "../api/telemetrySocket";

    export interface Telemetry { droneId: string; lat: number; lon: number; timestamp: number; }

    export function useTelemetry(map: Map | null) {
    const coordsRef = useRef<[number, number][]>([]);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!map) return;

        // инициализация пустого слоя трека
        map.addSource("track", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [] }, properties: {} } });
        map.addLayer({ id: "track-line", type: "line", source: "track", paint: { "line-color": "#0066ff", "line-width": 3 } });
        markerRef.current = new maplibregl.Marker({ color: "#0066ff" }).setLngLat([71.45,51.16]).addTo(map);

        const socket = createTelemetrySocket(pt => {
        coordsRef.current.push([pt.lon, pt.lat]);
        const src = map.getSource("track") as maplibregl.GeoJSONSource;
        src.setData({ type: "Feature", geometry: { type: "LineString", coordinates: coordsRef.current }, properties: {} });
        markerRef.current!.setLngLat([pt.lon, pt.lat]);
        });

        return () => { socket.disconnect(); };
    }, [map]);
    }
