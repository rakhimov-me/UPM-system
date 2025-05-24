import React, { useState } from "react";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { DronesDrawer } from "./components/DronesDrawer";
import { MapContainer } from "./components/MapContainer";
import { ZonesLayer } from "./components/ZonesLayer";
import { TrackLayer } from "./components/TrackLayer";
import { CoordinatesControl } from "./components/CoordinatesControl";
import { Sidebar } from "./components/Sidebar";
import "./index.css";

export function App() {
  const [showProfile, setShowProfile] = useState(false);
  const [showDrones, setShowDrones] = useState(false);

  // при открытии «Профиля» — закрываем «Дроны»
  const openProfile = () => {
    setShowDrones(false);
    setShowProfile(true);
  };
  // при открытии «Моих дронов» — закрываем «Профиль»
  const openDrones = () => {
    setShowProfile(false);
    setShowDrones(true);
  };
  // замыкание на onClose обоих, чтобы закрывать только свой
  const closeProfile = () => setShowProfile(false);
  const closeDrones = () => setShowDrones(false);

  return (
    <div className="app">
      <Sidebar
        onProfileClick={openProfile}
        onDronesClick={openDrones}
      />

      <div className="app__content">
        <MapContainer>
          <ZonesLayer />
          <TrackLayer />
          <CoordinatesControl />
        </MapContainer>
      </div>

      <ProfileDrawer
        isOpen={showProfile}
        onClose={closeProfile}
      />
      <DronesDrawer
        isOpen={showDrones}
        onClose={closeDrones}
      />
    </div>
  );
}
