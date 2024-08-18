import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { createMenu } from "./menu";
import { useIpc } from "./libs/ipcHub";
import { join } from "node:path";
import { usePty } from "./libs/pty";

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

// Modules to control application life and create native browser window

function createWindow() {
  console.log(__dirname);
  win = new BrowserWindow({
    // icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      webviewTag: true,
    },
    frame: false,
    titleBarStyle: "hidden",
  });

  useIpc(win);
  usePty(win);

  // win.webContents.on("did-finish-load", () => {
  //   win?.webContents.send("main-process-message", new Date().toLocaleString());
  // });

  win.webContents.setWindowOpenHandler((handler) => {
    win?.webContents.send("new-window", handler.url);
    return { action: "deny" };
  });

  app.on("web-contents-created", (_e, wc) => {
    wc.setWindowOpenHandler((event: any) => {
      win?.webContents.send("new-window", event.url);
      return { action: "deny" };
    });
  });

  win.loadURL("http://localhost:5173");
}
