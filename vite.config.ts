import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // 1. Reactを使えるようにするプラグイン
  plugins: [react(), tailwindcss()],

  // 2. Electronで読み込むために「相対パス」を指定する
  base: "./",

  // 3. ビルド設定
  build: {
    outDir: "dist", // Electronが読みに行くフォルダ名と合わせる
  },

  //@を"(projectroot)/src/"に設定
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ を src に割り当て
    },
  },

  //viteがdocker上において、リアルタイムでファイル変更を監視するための設定
  server: {
    watch: {
      usePolling: true, // これを追加！
      interval: 100, // 0.1秒ごとにチェックする設定（任意）
    },
    host: true, // Dockerからアクセス可能にするために必要
    strictPort: true,
  },
});
