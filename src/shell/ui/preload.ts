import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Mainへの通知
  notifyLoadClick: () => ipcRenderer.send("load-urls"),

  // Mainからの命令
  onUpdateViewHtml: (callback: (data: any) => void) => {
    ipcRenderer.on("update-urls", (_event, value) => callback(value));
  },
});
