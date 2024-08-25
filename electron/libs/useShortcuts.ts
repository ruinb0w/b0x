import type { BrowserWindow } from "electron";
import { globalShortcut } from "electron";

export function useGlobalShortcuts(win: BrowserWindow) {
  win.once("ready-to-show", () => {
    registorGlobalShortcut(win);
  });
  win.on("blur", () => {
    unregisterShortcuts();
  });
  win.on("focus", () => {
    registorGlobalShortcut(win);
  });
}

function registorGlobalShortcut(win: BrowserWindow) {
  Array.from({ length: 9 }, (_, i) => {
    globalShortcut.register(`Alt+${i}`, () => {
      win?.webContents.send("switch-app", i - 1);
    });
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
