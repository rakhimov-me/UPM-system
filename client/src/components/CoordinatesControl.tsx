// client/src/components/CoordinatesControl.tsx
import React, { useContext, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { MapContext } from "./MapContext";

function toDMS(deg: number, isLat: boolean) {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = Math.round((abs - d - m / 60) * 3600);
  const hemi = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
  return `${d}°${String(m).padStart(2, "0")}′${String(s).padStart(2, "0")}″${hemi}`;
}

export function CoordinatesControl() {
  const map = useContext(MapContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !ref.current) return;
    const update = () => {
      const c = map.getCenter();
      // Связываем обе координаты и добавляем DMS один раз в конце
      ref.current!.textContent = `${toDMS(c.lat, true)}   ${toDMS(c.lng, false)} DMS`;
    };
    update();
    map.on("move", update);
    return () => void map.off("move", update);
  }, [map]);

  return <div ref={ref} className="coordinates-overlay" />;
}
