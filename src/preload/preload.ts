import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // ウィンドウ操作用を追加
  send: (channel: string, data: any) => {
    const validChannels = ["window-control"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
