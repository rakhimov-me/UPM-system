import axios from "axios";
export interface Zone { id: number; name: string; geom: GeoJSON.Geometry; }

export function fetchZones(): Promise<Zone[]> {
  return axios.get("http://localhost:3000/zones").then(r => r.data);
}
