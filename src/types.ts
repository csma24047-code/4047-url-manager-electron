//electronの仕様上これだけglobalで宣言する必要あり
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export interface IElectronAPI {
  send: (channel: string, data: any) => void;
  loadData: () => Promise<any>;
}
