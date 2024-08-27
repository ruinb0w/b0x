import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { getApps } from "./app";
import { exec } from "child_process";
import { join } from "node:path";

export function useIpc(win: BrowserWindow | null) {
  ipcMain.on("full-screen", () => {
    win?.maximize();
  });
  ipcMain.on("search-app", async (event) => {
    const apps = await getApps();
    event.reply("search-app", apps);
  });
  ipcMain.on("open-app", (_event, path: string) => {
    exec(`"${path}"`, (error) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }
    });
  });
  ipcMain.on("get-file-path", (ev, file) => {
    ev.reply("get-file-path", `file://${join(__dirname, file)}`);
  });
  ipcMain.on("webview-keydown", (_ev, data) => {
    console.log("webview-keydown", data);
    win?.webContents.send("webview-keydown", data);
  });
}
