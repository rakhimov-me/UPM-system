// client/src/components/Sidebar.tsx
import React from "react";
import "../index.css";
import userIcon  from "../assets/user_icon.svg";
import droneIcon from "../assets/drone_icon.svg";

export function Sidebar({
  onProfileClick,
  onDronesClick,
}: {
  onProfileClick: () => void;
  onDronesClick: () => void;
}) {
  return (
    <div className="sidebar">
      <ul className="sidebar__list">
        <li className="sidebar__item" onClick={onProfileClick}>
          <img className="sidebar__icon" src={userIcon} alt="Профиль" />
          <span className="sidebar__label">Профиль</span>
        </li>
        <li className="sidebar__item" onClick={onDronesClick}>
          <img className="sidebar__icon" src={droneIcon} alt="Мои дроны" />
          <span className="sidebar__label">Мои дроны</span>
        </li>
      </ul>
    </div>
  );
}
