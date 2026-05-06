import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Mainへの通知
  notifyLoadClick: () => ipcRenderer.send("load-urls"),

  // Mainからの命令
  onUpdateViewHtml: (callback: (data: any) => void) => {
    // _event に : any を追加
    ipcRenderer.on("update-urls", (_event: any, value: any) => callback(value));
  },
  // ウィンドウ操作用を追加
  send: (channel: string, data: any) => {
    const validChannels = ["window-control"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
