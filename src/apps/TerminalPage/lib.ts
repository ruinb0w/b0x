import type { Terminal } from "@xterm/xterm";

let input = "";
let cursor = 0;

export function injectInputHanlder(xterm: Terminal) {
  xterm.onData((data: any) => {
    const code = data.charCodeAt(0);
    console.log("code", code);

    if (code == 27) {
      // handle arrow
      switch (data.substring(1)) {
        case "[C": // Right arrow
          if (cursor < input.length) {
            cursor += 1;
            xterm.write(data);
          }
          break;
        case "[D": // Left arrow
          if (cursor > 0) {
            cursor -= 1;
            xterm.write(data);
          }
          break;
      }
    } else if (code == 13) {
      // handle Enter
      window.ipcRenderer.send("shell", input);
      input = "";
      cursor = 0;
    } else if (code == 127) {
      // handle backspace
      if (cursor < 1) return;
      if (cursor < input.length) {
        const spaceLen = input.length - cursor;
        xterm.write(
          `\u0008${input.substring(cursor)}${" ".repeat(spaceLen)}\u001b[${spaceLen * 2}D`
        );
        input = input.substring(0, cursor - 1) + input.substring(cursor);
      } else {
        input = input.substring(0, input.length - 1);
        xterm.write("\u0008 \u0008");
      }
      cursor--;
    } else if (code == 27) {
      console.log("send esc");
      window.ipcRenderer.send("shell", data);
    } else if (code < 32) {
      // ignore special key
      return;
    } else {
      if (cursor < input.length) {
        xterm.write(`${data}${input.substring(cursor)}\u001b[${input.length - cursor}D`);
      } else {
        xterm.write(data);
      }
      input = input.substring(0, cursor) + data + input.substring(cursor);
      cursor += 1;
    }
  });
}

export function injectCombinationKeyHandler(xterm: Terminal) {
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
