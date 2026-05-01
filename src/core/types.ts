export interface IElectronAPI {
  // 1. 【通知】Mainに「ボタンが押された」ことを報告するだけ
  notifyLoadClick: () => void;

  // 2. 【通知】ブラウザを開くよう依頼する
  openBrowser: (url: string) => void;

  // 3. 【受信】Mainからの「これ表示して」という命令を聴くための窓口
  // callbackにはMainから送られてきた UrlItem[] が渡される
  onUpdateViewHtml: (callback: (html: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
