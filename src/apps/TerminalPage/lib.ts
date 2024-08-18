import "@xterm/xterm/css/xterm.css";
import "@xterm/xterm/lib/xterm.js";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { nextTick, ref } from "vue";

export interface Pty {
  pid: number;
  process: string;
}

export interface Xterm {
  pid: number;
  title: string;
  terminal: Terminal | null;
}

export function useXterm() {
  const terminals = ref<Xterm[]>([]);
  const current = ref<Xterm>();

  window.ipcRenderer.on("pty-list", (_event, data: { list: Pty[]; newPid?: number }) => {
    const { list, newPid } = data;
    console.log("pty-list", list);
    if (!newPid) return;
    terminals.value.push({ pid: newPid, title: "", terminal: null });
    nextTick(() => {
      createXterm(newPid);
    });
  });

  window.ipcRenderer.on("xterm-write", (_event, data: { content: string; pid: number }) => {
    const { content, pid } = data;
    console.log("xterm-write", data);
    const target = terminals.value.find((term) => term.pid == pid);
    target?.terminal?.write(content);
  });

  function createXterm(pid: number) {
    const container = document.querySelector(`.terminal-container.pid-${pid}`);
    console.log("container", container);
    if (!container) return;
    const term = new Terminal({
      cursorBlink: true,
      disableStdin: false,
      fontSize: 16,
      fontFamily: "GeistMono Nerd Font",
      theme: { background: "#222835" },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container as HTMLElement);
    term.onResize((size) => {
      term.resize(size.cols, size.rows);
    });
    term.onData((content: any) => {
      window.ipcRenderer.send("pty-write", { content, pid });
    });
    term.onResize((size) => {
      window.ipcRenderer.send("pty-resize", {
        cols: size.cols,
        rows: size.rows,
        pid,
      });
    });
    term.onTitleChange((title) => {
      const target = terminals.value.find((term) => term.pid == pid);
      if (!target) return;
      target.title = title;
    });
    window.addEventListener("resize", () => {
      fitAddon.fit();
    });
    fitAddon.fit();
    window.ipcRenderer.send("pty-write", { content: "clear\r", pid });
    const target = terminals.value.find((term) => term.pid == pid);
    if (!target) return;
    target.terminal = term;
    current.value = target;
  }

  function switchCurrent(pid: number) {
    const target = terminals.value.find((term) => term.pid == pid);
    if (!target) return;
    current.value = target;
  }
  function createPty() {
    window.ipcRenderer.send("pty-create");
  }
  function removePty(pid: number) {
    window.ipcRenderer.send("pty-remove", pid);
  }

  return { createXterm, terminals, current, switchCurrent, createPty, removePty };
}

export function injectCombinationKeyHandler(xterm: Terminal) {
  let input = "";
  let cursor = 0;
  // handle copy
  xterm.attachCustomKeyEventHandler((arg) => {
    if (arg.ctrlKey && arg.key === "c" && arg.type === "keydown") {
      const selection = xterm.getSelection();
      if (selection) {
        window.navigator.clipboard.writeText(selection);
        return false;
      }
    }
    if (arg.ctrlKey && arg.key === "v" && arg.type === "keydown") {
      navigator.clipboard.readText().then((data) => {
        xterm.write(`${data}${input.substring(cursor)}`);
        if (input.length - cursor) {
          // `\u001b0D` will move cursor to left once
          xterm.write(`\u001b[${input.length - cursor}D`);
        }
        input = input.substring(0, cursor) + data + input.substring(cursor);
        cursor += data.length;
        console.log(cursor, input);
      });
    }
    return true;
  });
}
