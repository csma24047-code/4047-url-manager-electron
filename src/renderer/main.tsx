import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/renderer/App.js"; // あなたが作るメインのUIコンポーネント
//import "./index.css"; // TailwindCSSなどのスタイル

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
