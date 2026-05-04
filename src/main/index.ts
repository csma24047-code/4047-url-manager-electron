//electronを使用
import { app, BrowserWindow, ipcMain } from "electron";
//パス解決
import { fileURLToPath } from "url";
import * as path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
//自作ファイル
import { pickAndReadJsonFile } from "@/main/file_io_func";
import { parseTxtToUrlItems } from "@/main/pure_func";

//ウィンドウ作成
export function create_window(options: {
  preloadPath: string;
  htmlPath: string;
}): void {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      sandbox: false, // preloadのcommonjs縛りを緩めるため
      contextIsolation: true, // コンテキスト分離を有効化
      nodeIntegration: false, // レンダラーでのNode.js利用を無効化（推奨）
      preload: options.preloadPath, // 橋渡し役のスクリプト
    },
  });
  // 開発時 (npm run dev) は Vite のサーバーを表示
  if (process.env.NODE_ENV === "development") {
    console.log("★★★ 開発モードで起動しています：URLを読み込みます ★★★");
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // 本番ビルド後は dist 内のファイルを読み込む
    console.log("★★★ 本番モードで起動しています：ファイルを読み込みます ★★★");
    mainWindow.loadFile(options.htmlPath);
  }
}

export function registerIpcHandlers(jsonPath: string) {
  //ファイルを読み込んで画面に表示
  ipcMain.on("load-urls", async (event) => {
    const rawText = await pickAndReadJsonFile(jsonPath);
    if (!rawText) return "";
    const html = parseTxtToUrlItems(rawText);
    event.reply("update-urls", html);
  });
}

// アプリの起動
export function initialize_app() {
  //実行場所はout/main/index.js(src/main/index.tsではない)
  const preloadPath = path.join(__dirname, "../preload/preload.mjs"); // preloadは通常 .mjs か .js
  const htmlPath = path.join(__dirname, "../renderer/index.html");
  const jsonPath = path.join(__dirname, "../../output/urls.json");

  app.whenReady().then(() => {
    registerIpcHandlers(jsonPath);
    create_window({ preloadPath, htmlPath });
  });
}

initialize_app();
