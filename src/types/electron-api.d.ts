/*PreloadとRendererの間の約束事であり、TypeScriptに window.electronAPI を認識させるための定義ファイル*/
import { URLItem } from "@/types/index";

export interface IElectronAPI {
  loadData: () => Promise<any>;
  saveUrl: (item: any) => Promise<any>;
  deleteUrl: (id: number) => Promise<any>;

  // ★ 専用の関数を型として定義
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  openInBrowser: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
