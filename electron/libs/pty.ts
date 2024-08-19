import type { BrowserWindow } from "electron";
import * as os from "node:os";
//@ts-ignore
import * as pty from "node-pty";
import { ipcMain } from "electron";

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export function usePty(win: BrowserWindow | null) {
  const ptys: pty.IPty[] = [];

  function genPty() {
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env,
    });

    ptyProcess.onData((content: string) => {
      win?.webContents.send("xterm-write", { content, pid: ptyProcess.pid });
    });
    ptyProcess.onExit((data) => {
      console.log("onExit", data);
    });
    ptys.push(ptyProcess);
    return ptyProcess;
  }
  ipcMain.on("pty-write", (_event, data: { content: string; pid: number }) => {
    console.log("pty-write", data);
    const { content, pid } = data;
    const target = ptys.find((pty) => pty.pid == pid);
    if (!target) return;
    target.write(`${content}`);
  });
  ipcMain.on("pty-resize", (_event, data: { cols: number; rows: number; pid: number }) => {
    const { cols, rows, pid } = data;
    const target = ptys.find((pty) => pty.pid == pid);
    if (!target) return;
    target.resize(cols, rows);
  });
  ipcMain.on("pty-switch", (_event, pid: number) => {
    console.log("pty-switch", pid);
  });
  ipcMain.on("pty-create", (event) => {
    const newPty = genPty();
    console.log("recive-create", newPty.pid);
    event.reply("pty-list", {
      list: ptys.map((pty) => {
        return {
          pid: pty.pid,
          process: pty.process,
        };
      }),
      newPid: newPty.pid,
    });
  });
  ipcMain.on("pty-remove", (_event, pid: number) => {
    console.log("pty-remove", pid);
    const targetIndex = ptys.findIndex((pty) => pty.pid == pid);
    if (targetIndex == -1) return;
    ptys[targetIndex].pause();
    ptys.splice(targetIndex, 1);
  });
  ipcMain.on("pty-list", (event) => {
    event.reply("pty-list", {
      list: ptys.map((pty) => {
        return {
          pid: pty.pid,
          process: pty.process,
        };
      }),
    });
  });
}
