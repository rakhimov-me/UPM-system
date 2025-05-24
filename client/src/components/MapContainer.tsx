import React, { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { MapContext } from "./MapContext";
import { MapBarRight } from "./MapBarRight";
import "../index.css";



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

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
     <div className="map-wrapper">
       <div ref={containerRef} className="map-container" />
      <MapContext.Provider value={map}>
+        <MapBarRight />
+        {children}
+      </MapContext.Provider>
     </div>
   );
}