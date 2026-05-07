import { dialog } from "electron";
import * as fs from "fs";

export async function pickAndReadTextFile(): Promise<string | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Text Files", extensions: ["txt"] }],
    properties: ["openFile"],
  });

  if (canceled || !filePaths[0]) return null;

  try {
    return fs.readFileSync(filePaths[0], "utf-8");
  } catch (error) {
    console.error("Failed to read file:", error);
    return null;
  }
}

export async function pickAndReadJsonFile(
  jsonPath: string,
): Promise<any | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    // フィルタをJSONに変更
    filters: [{ name: "JSON Files", extensions: ["json"] }],
    properties: ["openFile"],
  });

  if (canceled || !filePaths[0]) return null;

  try {
    const content = fs.readFileSync(filePaths[0], "utf-8");
    // 文字列をオブジェクトに変換
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read or parse JSON file:", error);
    return null;
  }
}
