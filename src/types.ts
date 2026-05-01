// src/types.ts

// TXTから読み込んで整形したあとのURLデータの形
export interface UrlItem {
  title: string;
  url: string;
  tags: string[];
}

// レンダラー側から使えるAPIの形（window.electronAPI の中身）
export interface IElectronAPI {
  readTxtFile: () => Promise<UrlItem[]>;
  openBrowser: (url: string) => void;
}

// TypeScriptに「windowの中にelectronAPIがあるよ」と教える
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
