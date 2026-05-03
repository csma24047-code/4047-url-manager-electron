import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  main: {
    plugins: [tsconfigPaths()],
    build: {
      externalizeDeps: true,
    },
    resolve: {
      //@を"(projectroot)/src/"に設定
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
  },
  preload: {
    plugins: [tsconfigPaths()],
    build: {
      externalizeDeps: true,
      rollupOptions: {
        output: {
          format: "cjs", // import を require に変換して出力
          entryFileNames: "preload.js",
        },
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
  },
  renderer: {
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/renderer"),
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
  },
});
