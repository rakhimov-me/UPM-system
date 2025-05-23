import { useEffect } from "react";
import type { Map } from "maplibre-gl";
import { fetchZones } from "../api/fetchZones";

export function useZones(map: Map | null) {
  useEffect(() => {
    if (!map) return;
    fetchZones().then(zones => {
      const features = zones.map(z => ({
        type: "Feature" as const,
        geometry: z.geom,
        properties: { name: z.name },
      }));
      map.addSource("zones", { type: "geojson", data: { type: "FeatureCollection" as const, features } });
      map.addLayer({ id: "zones-fill", type: "fill", source: "zones", paint: { "fill-color": "#f00", "fill-opacity": 0.2 } });
      map.addLayer({ id: "zones-border", type: "line", source: "zones", paint: { "line-color": "#f00", "line-width": 2 } });
    });
  }, [map]);
}
