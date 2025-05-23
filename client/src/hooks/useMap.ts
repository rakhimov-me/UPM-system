import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export function useMap(containerRef: React.RefObject<HTMLDivElement>) {
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
  }, [containerRef]);

  return mapRef.current;
}
