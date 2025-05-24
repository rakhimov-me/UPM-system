// client/src/components/Sidebar.tsx
import React from "react";
import "../index.css";

import profileIcon from "../assets/profile_icon.svg";
import calendarIcon from "../assets/calendar_icon.svg";
import documentIcon from "../assets/document_icon.svg";
import insuranceIcon from "../assets/insurance_icon.svg";
import questionIcon from "../assets/question_icon.svg";

export function Sidebar() { 
  return (
    <nav className="sidebar">
      <ul className="sidebar__list">
        <li className="sidebar__item">
          <img src={profileIcon} className="sidebar__icon" alt="Профиль" />
          <span className="sidebar__label">Профиль</span>
        </li>
        <li className="sidebar__item">
          <img src={calendarIcon} className="sidebar__icon" alt="Полёты" />
          <span className="sidebar__label">Полёты</span>
        </li>
        <li className="sidebar__item">
          <img src={documentIcon} className="sidebar__icon" alt="Документы" />
          <span className="sidebar__label">Документы</span>
        </li>
        <li className="sidebar__item">
          <img src={insuranceIcon} className="sidebar__icon" alt="Страхование" />
          <span className="sidebar__label">Страхование</span>
        </li>
      </ul>
      <div className="sidebar__help">
        <img src={questionIcon} className="sidebar__icon" alt="Помощь" />
        <span className="sidebar__label">Помощь</span>
      </div>
    </nav>
  );
}
