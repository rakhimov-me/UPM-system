import React from "react";
import { MapContainer } from "./components/MapContainer";
import { ZonesLayer } from "./components/ZonesLayer";
import { TrackLayer } from "./components/TrackLayer";

export function App() {
  return (
    <MapContainer>
      {(map) => (
        <>
          <ZonesLayer />
          <TrackLayer />
        </>
      )}
    </MapContainer>
  );
}
