import { app, BrowserWindow } from "electron";
import { createMenu } from "./menu";
import { useIpc } from "./libs/ipcHub";
import { join } from "node:path";
import { usePty } from "./libs/pty";
import { useManageData } from "./data/useManageData";
import { useGlobalShortcuts } from "./libs/useShortcuts";

let win: BrowserWindow | null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  win && createMenu(win);
});

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      webviewTag: true,
    },
    frame: false,
    titleBarStyle: "hidden",
  });

  useIpc(win);
  usePty(win);
  useManageData();
  useGlobalShortcuts(win);

  win.webContents.setWindowOpenHandler((details) => {
    console.log("details", details);
    win?.webContents.send("new-window", details);
    return { action: "deny" };
  });

  app.on("web-contents-created", (_e, wc) => {
    wc.setWindowOpenHandler((details: any) => {
      win?.webContents.send("new-window", details);
      return { action: "deny" };
    });
  });

  win.loadURL("http://localhost:5173");
}
