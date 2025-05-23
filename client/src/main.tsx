import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";  // либо создайте пустой файл, либо закомментируйте

const rootEl = document.getElementById("root");
if (!rootEl) console.error("Не найден #root в index.html");
else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
