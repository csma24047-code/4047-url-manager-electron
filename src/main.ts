import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { pickAndReadTextFile } from "./shell/fileio/func";
import { parseTxtToUrlItems } from "./core/pure_func";

//ウィンドウ作成
export function create_window(options: {
  preloadPath: string;
  htmlPath: string;
}): void {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: options.preloadPath,
      contextIsolation: true,
    },
  });

  win.loadFile(options.htmlPath);
}

export function registerIpcHandlers() {
  //ファイルを読み込んで画面に表示
  ipcMain.on("load-urls", async (event) => {
    const rawText = await pickAndReadTextFile();
    if (!rawText) return "";
    const html = parseTxtToUrlItems(rawText);
    event.reply("update-urls", html);
  });
}

// アプリの起動
export function initialize_app() {
  const preloadPath = path.join(__dirname, "shell/ui/preload.js");
  const htmlPath = path.join(__dirname, "shell/ui/index.html");

  app.whenReady().then(() => {
    console.log("App is ready!"); // これが出ているか確認
    registerIpcHandlers();
    create_window({ preloadPath, htmlPath });
  });
}

initialize_app();
