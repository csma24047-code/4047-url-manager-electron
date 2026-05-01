export function parseTxtToUrlItems(content: string): string {
  const items = content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => ({
      title: "無題のURL",
      url: line.trim(),
      tags: ["Imported"],
    }));

  return items
    .map(
      (item) => `
        <li class="url-card" onclick="window.electronAPI.openBrowser('${item.url}')">
      <div class="info">
        <strong>${item.title}</strong>
        <p class="url-text">${item.url}</p>
      </div>
      <div class="tags">
        ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </li>
  `,
    )
    .join("");
}
