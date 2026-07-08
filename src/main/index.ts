//electronを使用
import { app, BrowserWindow, ipcMain, screen } from "electron";
app.disableHardwareAcceleration(); // これを追加
import * as path from "path";

//ウィンドウ作成
export function create_window(options: {
  preloadPath: string;
  htmlPath: string;
}): void {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: true, //サイズを変更できるかどうか
    show: false, //アプリ画面の準備ができるまで表示させない
    frame: false, //標準のフレームを使わない
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: options.preloadPath,
      sandbox: false,
    },
  });

  // モード選択
  if (process.env.NODE_ENV === "development") {
    console.log("★★★ dev mode ★★★");
    mainWindow.loadURL("http://localhost:5173");
  } else {
    console.log("★★★ app mode ★★★");
    mainWindow.loadFile(options.htmlPath);
  }

  // 画面準備ができたら表示
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
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

export function registerIpcHandlers(jsonPath: string) {
  //後で追加
}

// アプリの起動
export function initialize_app() {
  //実行場所はout/main/index.cjs
  const preloadPath = path.join(__dirname, "../preload/preload.cjs");
  const htmlPath = path.join(__dirname, "../renderer/index.html");
  const jsonPath = path.join(__dirname, "../../database/urls.json");

  app.whenReady().then(() => {
    registerIpcHandlers(jsonPath);
    create_window({ preloadPath, htmlPath });
  });
}

initialize_app();
