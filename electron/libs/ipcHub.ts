import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { getApps } from "./app";
import { exec } from "child_process";

export function useIpc(win: BrowserWindow | null) {
  ipcMain.on("full-screen", () => {
    win?.maximize();
  });
  ipcMain.on("search-app", async (event) => {
    const apps = await getApps();
    event.reply("search-app", apps);
  });
  ipcMain.on("open-app", (_event, path: string) => {
    console.log("path", `start '${path}'`);
    exec(`"${path}"`, (error) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }
    });
  });
}
