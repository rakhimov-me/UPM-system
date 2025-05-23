// client/src/components/MapContext.tsx
import { createContext } from "react";
import type { Map } from "maplibre-gl";

// По умолчанию — нет карты
export const MapContext = createContext<Map | null>(null);
