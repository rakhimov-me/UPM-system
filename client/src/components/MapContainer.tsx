import React, { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { MapContext } from "./MapContext";

interface Props {
  children?: React.ReactNode;
}

export function MapContainer({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: containerRef.current,
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=13uJDYePQAdds9bDUBti",
      center: [71.45, 51.16],
      zoom: 10,
    });

    // Когда карта загрузится — кладём её в стейт
    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

   return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",    // <-- вот эта строчка
      }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
      />
      <MapContext.Provider value={map}>
        {children}
      </MapContext.Provider>
    </div>
  );
}
 