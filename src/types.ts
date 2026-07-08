//electronの仕様上これだけglobalで宣言する必要あり。rendererとmainの唯一の橋渡し
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

//rendererからmainに通知するインターフェース
export interface IElectronAPI {
  send: (channel: string, data: any) => void;
  loadData: () => Promise<any>;
  saveUrl: (item: any) => Promise<any>;
  deleteUrl: (id: number) => Promise<any>;
}
