import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  main: {
    plugins: [tsconfigPaths()],
    build: {
      externalizeDeps: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  preload: {
    plugins: [tsconfigPaths()],
    build: {
      externalizeDeps: true,
      rollupOptions: {
        output: {
          format: "cjs", // import を require に変換して出力
          entryFileNames: "preload.cjs",
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  renderer: {
    plugins: [tailwindcss(), react(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    //viteがdocker上において、リアルタイムでファイル変更を監視するための設定
    server: {
      watch: {
        usePolling: true, // これを追加！
        interval: 100, // x秒ごとに更新チェック
      },
      host: true, // Dockerからアクセス可能にするために必要
      strictPort: true,

      // 追記：ブラウザ側から見た接続先を明示的に指定
      hmr: {
        host: "localhost",
        port: 5173,
      },
    },
  },
});
