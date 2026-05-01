import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import * as fs from "fs";
import { UrlItem } from "./core/types";
import { create_window } from "./main_init";

/**
 * 外部ブラウザでURLを開く
 */
function handleOpenBrowser(_event: Electron.IpcMainEvent, url: string) {
  if (url) {
    shell.openExternal(url);
  }
}

/**
 * TXTファイルを選択して解析し、UrlItem[] を返す
 */
async function handleReadTxtFile(): Promise<UrlItem[]> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Text Files", extensions: ["txt"] }],
    properties: ["openFile"],
  });

  if (canceled || !filePaths[0]) return [];

  try {
    const content = fs.readFileSync(filePaths[0], "utf-8");
    return parseTxtToUrlItems(content);
  } catch (error) {
    console.error("Failed to read file:", error);
    return [];
  }
}

/**
 * テキスト内容を UrlItem 形式に変換する（純粋関数）
 */
function parseTxtToUrlItems(content: string): UrlItem[] {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => ({
      title: "無題のURL",
      url: line.trim(),
      tags: ["Imported"],
    }));
}

// 1. 通知を受け取る
ipcMain.on("on-load-click", async (event) => {
  const items = await handleReadTxtFile();

  // HTMLをMain側で組み立てる
  const html = items
    .map(
      (item) => `
    <li class="url-card" onclick="window.electronAPI.openBrowser('${item.url}')">
      <div class="info">
        <strong>${item.title}</strong>
        <p class="url-text">${item.url}</p>
      </div>
      <div class="tags">
        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </li>
  `,
    )
    .join("");

  event.reply("update-view-html", html);
});

// ブラウザ起動もMainで完結
ipcMain.on("open-browser", (_event, url) => {
  shell.openExternal(url);
});

/**
 * 全ての IPC ハンドラを登録する
 */
function registerIpcHandlers() {
  ipcMain.handle("read-txt-file", handleReadTxtFile);
  ipcMain.on("open-browser", handleOpenBrowser);
}

// アプリの起動
app.whenReady().then(() => {
  registerIpcHandlers();
  create_window();
});
