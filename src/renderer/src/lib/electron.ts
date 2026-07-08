// 画面側のグローバル変数をこのファイル内に閉じ込める
const api = window.electronAPI;

/**
 * アプリのデータをメインプロセスから読み込みます（urls と settings が返ります）
 */
export async function loadAppData() {
  return await api.loadData();
}

/**
 * ウィンドウの操作（最小化・最大化・閉じる）を行います
 */
export function controlWindow(action: "minimize" | "maximize" | "close") {
  api.send("window-control", action);
}

/**
 * ★ 新しいURLアイテムをメインプロセス経由で保存します
 */
export async function saveNewUrl(item: {
  id: number;
  title: string;
  url: string;
  tags: string[];
  addedAt: string;
}) {
  return await api.saveUrl(item);
}

export async function deleteUrlById(id: number) {
  return await window.electronAPI.deleteUrl(id);
}
