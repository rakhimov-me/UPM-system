import { createContext } from "react";
import type { Map } from "maplibre-gl";

// Наш контекст хранит либо Maplibre-инстанс, либо null, пока он не инициализировался
export const MapContext = createContext<Map | null>(null);
