import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import * as path from "path";
/**
 * ウィンドウを作成する
 */
export function create_window() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "./shell/preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "./shell/index.html"));
}
