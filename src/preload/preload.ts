import { contextBridge, ipcRenderer } from "electron";

// 画面（React）から呼び出せる関数を定義
contextBridge.exposeInMainWorld("electronAPI", {
  // 既存のコード：メインプロセスへ一方的に通知する（ウィンドウを閉じるなど）
  send: (channel: string, data: any) => {
    const validChannels = ["window-control"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // 新しく追加：メインプロセスにお願いして、結果（JSONデータ）を返してもらう
  loadData: async () => {
    // メインプロセスの ipcMain.handle("load-data") を呼び出して結果を待つ
    return await ipcRenderer.invoke("load-data");
  },

  saveUrl: async (item: any) => {
    return await ipcRenderer.invoke("save-url", item);
  },

  deleteUrl: async (id: number) => {
    return await ipcRenderer.invoke("delete-url", id);
  },
});
