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
  const fitAddon = new FitAddon();
  const throttledCreatePty = throttle(createPty, 1000);

  window.ipcRenderer.on("pty-list", (_event, data: { list: Pty[]; newPid?: number }) => {
    const { list, newPid } = data;
    if (!newPid) return;
    terminals.value.push({ pid: newPid, title: "", terminal: null });
    nextTick(() => {
      createXterm(newPid);
    });
  });

  window.ipcRenderer.on("xterm-write", (_event, data: { content: string; pid: number }) => {
    const { content, pid } = data;
    const target = terminals.value.find((term) => term.pid == pid);
    target?.terminal?.write(content);
  });

  function createXterm(pid: number) {
    const container = document.querySelector(`.terminal-container.pid-${pid}`);
    if (!container) return;
    const term = new Terminal({
      cursorBlink: true,
      disableStdin: false,
      fontSize: 16,
      fontFamily: "GeistMono Nerd Font",
      theme: { background: "#222835" },
    });
    term.loadAddon(fitAddon);
    injectXtermShortcuts({ terminal: term, pid, title: "" });
    term.open(container as HTMLElement);
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

    setTimeout(() => {
      fitAddon.fit();
    }, 100);
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
    nextTick(() => {
      target.terminal?.focus();
    });
  }
  function createPty() {
    window.ipcRenderer.send("pty-create");
  }
  function removePty(pid: number) {
    const targetIndex = terminals.value.findIndex((term) => term.pid == pid);
    if (targetIndex == -1) return;
    const disposedTerminal = terminals.value.splice(targetIndex, 1)[0];
    disposedTerminal.terminal?.dispose();
    window.ipcRenderer.send("pty-remove", pid);
    if (terminals.value.length > 0) {
      const prevIndex = targetIndex >= 1 ? targetIndex - 1 : 0;
      switchCurrent(terminals.value[prevIndex].pid);
    } else {
      current.value = undefined;
    }
  }

  function injectXtermShortcuts(term: Xterm) {
    if (!term.terminal) return;

    term.terminal.attachCustomKeyEventHandler((arg) => {
      // handle copy
      if (arg.ctrlKey && arg.key === "c" && arg.type === "keydown") {
        const selection = term.terminal?.getSelection();
        if (selection) {
          window.navigator.clipboard.writeText(selection);
          return false;
        }
      }
      // block combinationkey for DomShortcuts
      if (
        arg.ctrlKey &&
        (!isNaN(Number(arg.key)) || arg.key == "t" || arg.key == "w" || arg.key == "v")
      ) {
        return false;
      }
      return true;
    });
  }

  function injectDomShortcuts() {
    const handleShortcuts = (event: any) => {
      // switch terminal
      if (event.ctrlKey && !isNaN(Number(event.key))) {
        const targetPid = terminals.value[Number(event.key) - 1]?.pid;
        targetPid && switchCurrent(targetPid);
      }
      // new terminal
      if (event.ctrlKey && event.key === "t") {
        throttledCreatePty();
      }
      // close terminal
      if (event.ctrlKey && event.key == "w") {
        current.value && removePty(current.value.pid);
      }
    };
    const clearShortcuts = () => {
      document.removeEventListener("keydown", handleShortcuts);
    };
    document.addEventListener("keydown", handleShortcuts);

    return clearShortcuts;
  }

  return {
    createXterm,
    terminals,
    current,
    switchCurrent,
    createPty,
    removePty,
    injectDomShortcuts,
  };
}

function throttle(func: (arg: any) => void, wait: number) {
  // let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return (args?: any) => {
    const now = Date.now();

    if (now - previous > wait) {
      func(args);
      previous = now;
    }
  };
}
