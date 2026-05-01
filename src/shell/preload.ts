import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Mainへの通知（送りっぱなし）
  notifyLoadClick: () => ipcRenderer.send("on-load-click"),
  openBrowser: (url: string) => ipcRenderer.send("open-browser", url),

  // Mainからの命令を受け取る窓口
  onUpdateViewHtml: (callback: (data: any) => void) => {
    ipcRenderer.on("update-view", (_event, value) => callback(value));
  },
});
