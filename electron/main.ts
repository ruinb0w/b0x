import { app, BrowserWindow, ipcMain } from "electron";
import { createMenu } from "./menu";
import { useIpc } from "./libs/ipcHub";
import { join } from "node:path";
import { usePty } from "./libs/pty";
import { useManageData } from "./data/useManageData";
import { useGlobalShortcuts } from "./libs/useShortcuts";
import { createSeperateWindow } from "./libs/window";

let win: BrowserWindow | null;

// ignore certificate error
app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// ignore cors error
// app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
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

// 使用window.open打开页面时会触发
app.on("web-contents-created", (_e, wc) => {
  wc.setWindowOpenHandler((details: any) => {
    win?.webContents.send("new-window", details);
    return { action: "deny" };
  });
});

app.whenReady().then(() => {
  createWindow();
  win && createMenu(win);
  ipcMain.on("seperate-window", (_event, data) => {
    createSeperateWindow(data);
  });
});

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      webviewTag: true,
      webSecurity: false,
    },
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
  });

  useIpc(win);
  usePty(win);
  useManageData();
  useGlobalShortcuts(win);

  // webview内页面popup时会触发
  win.webContents.setWindowOpenHandler((details) => {
    win?.webContents.send("new-window", details);
    return { action: "deny" };
  });

  win.loadURL("http://localhost:5173");
}
