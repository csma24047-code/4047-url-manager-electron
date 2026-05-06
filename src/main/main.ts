//electronを使用
import { app, BrowserWindow, ipcMain, screen } from "electron";
import * as path from "path";

//自作ファイル
import { pickAndReadJsonFile } from "@/main/file-io-func";
import { parseTxtToUrlItems } from "@/main/pure-func";

//ウィンドウ作成
export function create_window(options: {
  preloadPath: string;
  htmlPath: string;
}): void {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false, // 完全にhtml側のみで画面を構成()
    webPreferences: {
      contextIsolation: true, // コンテキスト分離を有効化
      nodeIntegration: false, // レンダラーでのNode.js利用を無効化（推奨）
      preload: options.preloadPath, // 橋渡し役のスクリプト
    },
  });

  if (process.env.NODE_ENV === "development") {
    // 開発時 (npm run dev) は Vite のサーバーを表示
    console.log("★★★ dev mode ★★★");
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // 本番ビルド後は dist 内のファイルを読み込む
    console.log("★★★ app mode ★★★");
    mainWindow.loadFile(options.htmlPath);
  }
}

//ブラウザ操作がされたとき
ipcMain.on("window-control", (event, action) => {
  // 操作対象のウィンドウを特定する
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  switch (action) {
    case "minimize":
      win.minimize();
      break;
    case "maximize":
      win.isMaximized() ? win.unmaximize() : win.maximize();
      break;
    case "close":
      win.close();
      break;
  }
});

// main.ts
let isDragging = false;
let offset = { x: 0, y: 0 };

ipcMain.on("window-drag-start", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  const mousePos = screen.getCursorScreenPoint();

  // getPosition() は [number, number] を返しますが、
  // 万が一に備えてデフォルト値 [0, 0] を設定するか、win があることを再確認します
  const position = win.getPosition();
  const winX = position[0] ?? 0; // undefined の場合は 0 を使う
  const winY = position[1] ?? 0;

  offset = {
    x: mousePos.x - winX,
    y: mousePos.y - winY,
  };
  isDragging = true;
});

ipcMain.on("window-drag-move", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  // win が存在し、かつドラッグ中であることを厳密にチェック
  if (!win || !isDragging) return;

  const mousePos = screen.getCursorScreenPoint();

  // 以前の座標計算を適用
  win.setPosition(
    Math.floor(mousePos.x - offset.x),
    Math.floor(mousePos.y - offset.y),
  );
});

ipcMain.on("window-drag-end", () => {
  isDragging = false;
});

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
  //実行場所はout/main/index.cjs
  const preloadPath = path.join(__dirname, "../preload/preload.cjs");
  const htmlPath = path.join(__dirname, "../renderer/renderer.html");
  const jsonPath = path.join(__dirname, "../../output/urls.json");

  app.whenReady().then(() => {
    registerIpcHandlers(jsonPath);
    create_window({ preloadPath, htmlPath });
  });
}

initialize_app();
