import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // 1. Reactを使えるようにするプラグイン
  plugins: [react()],

  // 2. Electronで読み込むために「相対パス」を指定する
  base: "./",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ を src に割り当て
    },
  },

  // 3. ビルド設定
  build: {
    outDir: "dist", // Electronが読みに行くフォルダ名と合わせる
  },
});
