import { ipcMain, dialog } from "electron";
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
