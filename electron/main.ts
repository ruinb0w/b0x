import { app, BrowserWindow, globalShortcut } from "electron";
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
  registorGlobalShortcut();
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

  win.once("ready-to-show", () => {
    registorGlobalShortcut();
  });
  win.on("blur", () => {
    unregisterShortcuts();
  });
  win.on("focus", () => {
    registorGlobalShortcut();
  });

  win.webContents.setWindowOpenHandler((details) => {
    console.log("details", details);
    win?.webContents.send("new-window", details);
    return { action: "deny" };
  });

  app.on("web-contents-created", (_e, wc) => {
    console.log("web-content-create", _e, wc);
    wc.setWindowOpenHandler((details: any) => {
      win?.webContents.send("new-window", details);
      return { action: "deny" };
    });
  });

  win.loadURL("http://localhost:5173");
}

function registorGlobalShortcut() {
  Array.from({ length: 9 }, (_, i) => {
    globalShortcut.register(`Alt+${i}`, () => {
      win?.webContents.send("switch-app", i - 1);
    });
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
