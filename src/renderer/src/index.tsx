import React from "react";
import ReactDOM from "react-dom/client";
import "@/renderer/style.css"; //先にcssを読み込む
import { App } from "@/renderer/src/app"; // メインのUIコンポーネント

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
