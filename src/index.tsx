import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.js"; // あなたが作るメインのUIコンポーネント
import "@/style.css"; // TailwindCSSなどのスタイル

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
