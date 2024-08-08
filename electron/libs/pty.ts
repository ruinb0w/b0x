import type { BrowserWindow } from "electron";
import * as os from "node:os";
// @ts-ignore
import * as pty from "node-pty";
import { ipcMain } from "electron";

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export function usePty(win: BrowserWindow | null) {
  console.log("usePty");
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  ptyProcess.onData((data: string) => {
    // process.stdout.write(data);
    win?.webContents.send("shell", data);
  });

  ipcMain.on("shell", (_event, data: string) => {
    console.log("shell", data);
    ptyProcess.write(data);
  });
}
