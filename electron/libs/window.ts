import { BrowserWindow } from "electron";

export function createSeperateWindow(data: { url: string }) {
  const window = new BrowserWindow();
  window.setMenu(null);
  window.webContents.setWindowOpenHandler((details) => {
    window.loadURL(details.url);
    return { action: "deny" };
  });
  window.loadURL(data.url);
}
