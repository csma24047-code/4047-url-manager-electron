import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // ウィンドウ操作用を追加
  send: (channel: string, data: any) => {
    const validChannels = [
      "window-control",
      "window-drag-start",
      "window-drag-move",
      "window-drag-end",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
