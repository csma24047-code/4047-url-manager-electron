import React from "react";
import ReactDOM from "react-dom/client";
import "@/renderer/style.css"; //先にcssを読み込む
import { App } from "@/renderer/App"; // メインのUIコンポーネント

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
