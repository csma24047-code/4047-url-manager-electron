import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS, URLItem } from "@/types/index";

// 画面（React）から呼び出せる関数を定義
contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.send("window-control", "minimize"),
  maximizeWindow: () => ipcRenderer.send("window-control", "maximize"),
  closeWindow: () => ipcRenderer.send("window-control", "close"),

  // 既存のコード：メインプロセスへ一方的に通知する（ウィンドウを閉じるなど）
  loadData: async () => ipcRenderer.invoke(IPC_CHANNELS.LOAD_DATA),
  saveUrl: async (item: URLItem) =>
    ipcRenderer.invoke(IPC_CHANNELS.SAVE_URL, item),
  deleteUrl: async (id: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_URL, id),
});
