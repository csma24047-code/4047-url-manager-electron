const urlListElement = document.getElementById("urlList") as HTMLUListElement;
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;

// ボタンが押されただけ報告
loadBtn?.addEventListener("click", () => {
  window.electronAPI.notifyLoadClick();
});

// Mainからのstrを出力
window.electronAPI.onUpdateViewHtml((html: string) => {
  if (urlListElement) {
    urlListElement.innerHTML = html;
  }
});
