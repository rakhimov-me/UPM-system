  import React, { useEffect, useRef } from "react";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import axios from "axios";
  import { io, Socket } from "socket.io-client";

  interface Telemetry {
    droneId: string;
    lat: number;
    lon: number;
    alt?: number;
    timestamp: number;
  }

  export function App() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const trackCoords = useRef<[number, number][]>([]);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
      if (!mapContainer.current) return;

      // 1) Инициализация карты
     mapRef.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://api.maptiler.com/maps/basic-v2/style.json?key=13uJDYePQAdds9bDUBti",
      center: [71.45, 51.16],
      zoom: 10,
    });


      mapRef.current.on("load", () => {
        // 2) Загрузка и отображение зон
        axios.get("http://localhost:3000/zones").then((resp) => {
          const zonesFeatures = resp.data.map((z: any) => ({
            type: "Feature" as const,
            geometry: z.geom as GeoJSON.Geometry,
            properties: { name: z.name },
          }));
          
          mapRef.current!.addSource("zones", {
            type: "geojson",
            data: {
              type: "FeatureCollection" as const,
              features: zonesFeatures,
            },
          });

          mapRef.current!.addLayer({
            id: "zones-fill",
            type: "fill",
            source: "zones",
            paint: { "fill-color": "#f00", "fill-opacity": 0.2 },
          });
          mapRef.current!.addLayer({
            id: "zones-border",
            type: "line",
            source: "zones",
            paint: { "line-color": "#f00", "line-width": 2 },
          });
        });

        // 3) Добавляем источник и слой для трека дрона
        mapRef.current!.addSource("track", {
          type: "geojson",
          data: {
            type: "Feature" as const,
            geometry: {
              type: "LineString" as const,
              coordinates: [],
            },
            properties: {},                    // <-- обязательно
          },
        });

        mapRef.current!.addLayer({
          id: "track-line",
          type: "line",
          source: "track",
          paint: { "line-color": "#0066ff", "line-width": 3 },
        });

        // 4) Инициализируем маркер
        markerRef.current = new maplibregl.Marker({ color: "#0066ff" })
          .setLngLat([71.45, 51.16])
          .addTo(mapRef.current!);
      });

      // 5) Socket.IO для телеметрии
      const socket: Socket = io("http://localhost:3000", {
        transports: ["websocket"],
      });

      socket.on("connect", () =>
        console.log("WS connected", socket.id)
      );

      socket.on("telemetry", (pt: Telemetry) => {
        console.log("Telemetry:", pt);

        // Обновляем координаты трека
        trackCoords.current.push([pt.lon, pt.lat]);
        const trackSource = mapRef.current!
          .getSource("track") as maplibregl.GeoJSONSource;
        trackSource.setData({
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: trackCoords.current,
          },
          properties: {},                      // <-- добавили здесь
        });

        // Перемещаем маркер
        markerRef.current!.setLngLat([pt.lon, pt.lat]);
      });

      return () => {
        socket.disconnect();
        mapRef.current?.remove();
      };
    }, []);

    return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
  }
