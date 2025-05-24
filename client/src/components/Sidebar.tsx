import React from "react";
import "./css/Sidebar.css";
import logo from "../assets/logo.svg";
import userIcon from "../assets/user_icon.svg";
import droneIcon from "../assets/drone-min_icon.svg";

export function Sidebar({
  onProfileClick,
  onDronesClick,
}: {
  onProfileClick: () => void;
  onDronesClick: () => void;
  activeDrawer: "profile" | "drones" | null;
}) {

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
  const allItems = document.querySelectorAll(".sidebar__item");
  allItems.forEach(item => item.classList.remove("active"));
  e.currentTarget.classList.add("active");
};

return (
  <div className="sidebar">
    <div className="sidebar__logo">
      <img src={logo} alt="Nebosvod Logo" className="sidebar__logo-img" />
    </div>
    <ul className="sidebar__list">
      <li className="sidebar__item" onClick={(e) => { onProfileClick(); handleItemClick(e); }}>
        <img className="sidebar__icon" src={userIcon} alt="Профиль" />
        <span className="sidebar__label">Профиль</span>
      </li>
      <li className="sidebar__item" onClick={(e) => { onDronesClick(); handleItemClick(e); }}>
        <img className="sidebar__icon" src={droneIcon} alt="Мои дроны" />
        <span className="sidebar__label">Мои дроны</span>
      </li>
    </ul>
  </div>
);

}
