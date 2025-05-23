import React, { useRef, useEffect } from "react";
import { MapContext } from "./MapContext";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function MapContainer({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: "https://api.maptiler.com/maps/basic-v2/style.json?key=13uJDYePQAdds9bDUBti",
      center: [71.45, 51.16],
      zoom: 10,
    });
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <MapContext.Provider value={mapRef.current}>
      <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
      {children}
    </MapContext.Provider>
  );
}
