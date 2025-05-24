import React, { ReactNode } from "react";
import "../index.css"; // здесь лежат .drawer, .drawer__header и пр.

interface DrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ isOpen, title, onClose, children }: DrawerProps) {
  return (
    <div className={`drawer${isOpen ? " open" : ""}`}>
      <div className="drawer__header">
        <h2>{title}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="drawer__body">{children}</div>
    </div>
  );
}
