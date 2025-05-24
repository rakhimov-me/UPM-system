import React, { ReactNode } from "react";
import "./css/Drawer.css";

interface DrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ isOpen, title, onClose, children }: DrawerProps) {
  const handleClose = () => {
    const items = document.querySelectorAll(".sidebar__item");
    items.forEach(item => item.classList.remove("active"));
    onClose();
  };

  return (
    <>
      {/* Прозрачная кликабельная зона — закрытие при клике */}
      {isOpen && <div className="drawer-backdrop" onClick={handleClose} />}
      
      {/* Сам Drawer */}
      <div className={`drawer${isOpen ? " open" : ""}`}>
        <div className="drawer__header">
          <h2>{title}</h2>
          <button onClick={handleClose}>✕</button>
        </div>
        <div className="drawer__body">{children}</div>
      </div>
    </>
  );
}
