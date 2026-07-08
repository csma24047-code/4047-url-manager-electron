import { contextBridge, ipcRenderer } from "electron";

//画面からウィンドウフレームに対しての操作が行われたらmainへそれを通知
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data: any) => {
    const validChannels = ["window-control"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
