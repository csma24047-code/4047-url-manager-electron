const urlListElement = document.getElementById("urlList") as HTMLUListElement;
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;

// ボタンが押されたら「押されたよ」とだけ報告する
loadBtn?.addEventListener("click", () => {
  window.electronAPI.notifyLoadClick();
});

// Mainから「これを出せ」と言われたHTMLをそのまま貼り付けるだけ
window.electronAPI.onUpdateViewHtml((html: string) => {
  if (urlListElement) {
    urlListElement.innerHTML = html;
  }
});
