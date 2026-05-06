export interface IElectronAPI {
  send: (channel: string, data: any) => void; // これが必要
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
