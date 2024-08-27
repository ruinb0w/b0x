import { ipcRenderer } from "electron";

window.addEventListener("keydown", (ev) => {
  console.log("keydown", { ctrlKey: ev.ctrlKey, key: ev.key });
  ipcRenderer.send("webview-keydown", { ctrlKey: ev.ctrlKey, key: ev.key });
});
