// src/main.ts
import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import * as path from "path";
import * as fs from "fs";
import { UrlItem } from "./types";

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      // 変換後の preload.js は dist に書き出される想定
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  // index.htmlの場所はプロジェクト構造に合わせて調整
  win.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("read-txt-file", async (): Promise<UrlItem[]> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Text Files", extensions: ["txt"] }],
    properties: ["openFile"],
  });

  if (canceled || !filePaths[0]) return [];

  const content = fs.readFileSync(filePaths[0], "utf-8");

  // 文字列から UrlItem オブジェクトの配列に変換
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => ({
      title: "無題のURL", // 必要に応じて解析ロジックを追加
      url: line.trim(),
      tags: ["Imported"],
    }));
});

// ブラウザを開く処理も追加
ipcMain.on("open-browser", (_event, url: string) => {
  shell.openExternal(url);
});

app.whenReady().then(createWindow);
