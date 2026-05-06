//electronを使用
import { app, BrowserWindow, ipcMain, screen } from "electron";
app.disableHardwareAcceleration(); // これを追加
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
    titleBarStyle: "hidden",
    resizable: true,
    show: false, //準備ができるまで画面を表示させない
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: options.preloadPath,
      sandbox: false,
    },
  });

  // ★読み込みは関数の外側（すぐ下）で行う
  if (process.env.NODE_ENV === "development") {
    console.log("★★★ dev mode ★★★");
    mainWindow.loadURL("http://localhost:5173");
  } else {
    console.log("★★★ app mode ★★★");
    mainWindow.loadFile(options.htmlPath);
  }

  // ★準備ができたら表示する
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.webContents.openDevTools(); // 必要ならここで開く（ただし別ウィンドウ推奨）
  });
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
let startSize = { width: 0, height: 0 }; // ★サイズを記憶する箱を用意

ipcMain.on("window-drag-start", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  const mousePos = screen.getCursorScreenPoint();
  const position = win.getPosition();
  const size = win.getSize();

  // ?? 0 をつけることで、「もし左側が undefined なら 0 を使う」という命令になります
  offset = {
    x: mousePos.x - (position[0] ?? 0),
    y: mousePos.y - (position[1] ?? 0),
  };

  // ここがエラーの核心：size[0] や size[1] が undefined の可能性を排除します
  startSize = {
    width: size[0] ?? 800, // デフォルトの幅（例：800）
    height: size[1] ?? 600, // デフォルトの高さ（例：600）
  };

  isDragging = true;
});

ipcMain.on("window-drag-move", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || !isDragging) return;

  const mousePos = screen.getCursorScreenPoint();

  // ★ setPosition ではなく setBounds を使う
  // 「この位置へ行け、そしてサイズは絶対これ（startSize）だ！」と同時に命令する
  win.setBounds(
    {
      x: Math.round(mousePos.x - offset.x), // floor ではなく round がおすすめ
      y: Math.round(mousePos.y - offset.y),
      width: startSize.width,
      height: startSize.height,
    },
    false,
  ); // 第2引数 false でアニメーションによる遅延を防ぐ
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
  const htmlPath = path.join(__dirname, "../renderer/index.html");
  const jsonPath = path.join(__dirname, "../../output/urls.json");

  app.whenReady().then(() => {
    registerIpcHandlers(jsonPath);
    create_window({ preloadPath, htmlPath });
  });
}

initialize_app();
