// src/preload.ts
import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "./types";

const api: IElectronAPI = {
  readTxtFile: () => ipcRenderer.invoke("read-txt-file"),
  openBrowser: (url: string) => ipcRenderer.send("open-browser", url),
};

contextBridge.exposeInMainWorld("electronAPI", api);
