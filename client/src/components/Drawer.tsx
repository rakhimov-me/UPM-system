import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div
        className={`overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`drawer ${isOpen ? "open" : ""}`}>
        <header className="drawer-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>
        <div className="drawer-content">{children}</div>
      </aside>
    </>
  );
};
