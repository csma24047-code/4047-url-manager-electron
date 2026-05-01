// src/renderer.ts
import { UrlItem } from "./types";

const urlListElement = document.getElementById("urlList") as HTMLUListElement;
const loadBtn = document.getElementById("loadBtn") as HTMLButtonElement;

function displayUrls(items: UrlItem[]) {
  if (!urlListElement) return;
  urlListElement.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "url-card";

    li.innerHTML = `
      <div class="info">
        <strong>${item.title}</strong>
        <p class="url-text">${item.url}</p>
      </div>
      <div class="tags">
        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;

    // クリックでブラウザを開くイベント（セキュリティ上、innerHTMLの中に直接書くよりこちらが推奨）
    li.addEventListener("click", () => {
      window.electronAPI.openBrowser(item.url);
    });

    urlListElement.appendChild(li);
  });
}

loadBtn?.addEventListener("click", async () => {
  const data = await window.electronAPI.readTxtFile();
  displayUrls(data);
});
