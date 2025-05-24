import React, { useContext, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { MapContext } from "./MapContext";
import "./css/CoordinatesOverlay.css";

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
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [isDD, setIsDD] = useState(false);

  useEffect(() => {
    if (!map) return;
    const update = () => {
      const c = map.getCenter();
      setCoords({ lat: c.lat, lng: c.lng });
    };
    update();
    map.on("move", update);
    return () => void map.off("move", update);
  }, [map]);

  // Обработка клика по DMS/DD
  const handleFormatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDD((prev) => !prev);
  };

  return (
    <div className="coordinates-overlay">
      <span className="coordinates-overlay__value">
        {isDD
          ? `${coords.lat.toFixed(6)} ${coords.lng.toFixed(6)}`
          : `${toDMS(coords.lat, true)} ${toDMS(coords.lng, false)}`}
      </span>
      <a
        href="#"
        className="coordinates-overlay__format"
        tabIndex={0}
        onClick={handleFormatClick}
        title={isDD ? "Показать DMS" : "Показать DD"}
      >
        {isDD ? "DD" : "DMS"}
      </a>
    </div>
  );
}
