//Main、Preload、Rendererの全員が共通で使う型とIPCチャンネルの定義

export interface URLItem {
  id: number;
  title: string;
  url: string;
  tags: string[];
  addedAt: string;
}

// アプリ全体のデータ構造
export interface AppData {
  urls: URLItem[];
  settings: {
    darkMode: boolean;
  };
}

// IPC通信のチャンネル名（タイポ防止の一元管理）
export const IPC_CHANNELS = {
  LOAD_DATA: "load-data",
  SAVE_URL: "save-url",
  DELETE_URL: "delete-url",
  WINDOW_CONTROL: "window-control",
} as const;
