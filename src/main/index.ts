//electronを使用
import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import * as fs from "fs";

import { IPC_CHANNELS } from "@/types/index";

app.disableHardwareAcceleration(); // CPUのみでレンダリング

//ウィンドウ作成
export function createWindow(options: {
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
  // 画面側から「load-data」という名前でリクエストが来たら実行する処理
  ipcMain.handle(IPC_CHANNELS.LOAD_DATA, async () => {
    try {
      // 1. 指定されたパス（urls.json）が存在するか確認
      if (!fs.existsSync(jsonPath)) {
        // もしファイルがなければ、デフォルトの初期データを返したり、空のファイルを生成する
        const initialData = { urls: [], settings: { darkMode: true } };
        // ディレクトリがなければ作成
        fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
        // 空のファイルを作成
        fs.writeFileSync(
          jsonPath,
          JSON.stringify(initialData, null, 2),
          "utf-8",
        );
        return initialData;
      }

      // 2. ファイルが存在すれば、中身をテキストとして読み込む
      const fileRaw = fs.readFileSync(jsonPath, "utf-8");

      // 3. テキスト（文字列）をJavaScriptのオブジェクト/JSONに変換する
      const jsonData = JSON.parse(fileRaw);

      // 4. 画面（React）側にデータを送り返す
      return jsonData;
    } catch (error) {
      console.error("データの読み込みに失敗しました:", error);
      // エラーが起きた場合は最低限アプリがクラッシュしないように初期構造を返す
      return { urls: [], settings: { darkMode: true } };
    }
  });
  ipcMain.handle(IPC_CHANNELS.SAVE_URL, async (_event, newUrlItem) => {
    try {
      // 現在のファイルを読み込む
      const fileRaw = fs.readFileSync(jsonPath, "utf-8");
      const jsonData = JSON.parse(fileRaw);

      // 新しいアイテムを配列に追加
      jsonData.urls.push(newUrlItem);

      // ファイルに上書き保存（インデント付きで見やすく）
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");

      return { success: true };
    } catch (error) {
      console.error("データの保存失敗:", error);
      // error が Error オブジェクトなら message を使い、そうでなければ文字列にする
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  });

  // ★新しく追加：URLの削除処理
  ipcMain.handle(
    IPC_CHANNELS.DELETE_URL,
    async (_event, idToDelete: number) => {
      try {
        const fileRaw = fs.readFileSync(jsonPath, "utf-8");
        const jsonData = JSON.parse(fileRaw);

        // 指定されたID以外のデータだけで新しい配列を作る（＝指定されたIDを削除）
        jsonData.urls = jsonData.urls.filter(
          (item: any) => item.id !== idToDelete,
        );

        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");
        return { success: true };
      } catch (error) {
        console.error("データの削除失敗:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
      }
    },
  );

  // ★ 追加：外部ブラウザでURLを開く
  ipcMain.handle("open-url", async (_event, url: string) => {
    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        await shell.openExternal(url);
      }
    } catch (error) {
      console.error("URLを開けませんでした:", error);
    }
  });
}

// アプリの起動
export function initializeApp() {
  //実行場所はout/main/index.cjs
  const preloadPath = path.join(__dirname, "../preload/preload.cjs");
  const htmlPath = path.join(__dirname, "../renderer/index.html");

  app.whenReady().then(() => {
    let jsonPath: string;

    if (!app.isPackaged) {
      // 🟢 開発中：プロジェクトのルート直下（srcと同じ階層など）に保存する
      // これならVS Codeやエクスプローラーからいつでも直接手動で弄れる！
      jsonPath = path.join(__dirname, "../database/urls.json");
    } else {
      // 🔵 製品版（.exe化された後）：OS公認の安全なユーザーデータ領域に保存する
      // これで権限エラーも、アップデートでデータが消える問題も回避！
      jsonPath = path.join(
        app.getPath("userData"),
        "urls-manager-app-db/urls.json",
      );
    }

    console.log("現在のデータ保存先:", jsonPath);

    registerIpcHandlers(jsonPath);
    createWindow({ preloadPath, htmlPath });
  });
}

initializeApp();
