import React from "react";
import { MapContainer }    from "./components/MapContainer";
import { ZonesLayer }     from "./components/ZonesLayer";
import { TrackLayer }     from "./components/TrackLayer";
import { CoordinatesControl } from "./components/CoordinatesControl";

export function App() {
  return (
    <MapContainer>
      <ZonesLayer />
      <TrackLayer />
      <CoordinatesControl />
    </MapContainer>
  );
}
