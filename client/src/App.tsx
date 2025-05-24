import React from "react";
import { MapContainer }    from "./components/MapContainer";
import { ZonesLayer }     from "./components/ZonesLayer";
import { TrackLayer }     from "./components/TrackLayer";
import { CoordinatesControl } from "./components/CoordinatesControl";
import { Sidebar } from "./components/Sidebar";
import "./index.css";

export function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="app__content">
        <MapContainer>
        <ZonesLayer />
        <TrackLayer />
        <CoordinatesControl />
        </MapContainer>
      </div>
    </div>
  );
}
