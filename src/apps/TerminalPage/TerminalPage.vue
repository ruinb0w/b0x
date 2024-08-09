<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import "@xterm/xterm/lib/xterm.js";
import { injectInputHanlder, injectCombinationKeyHandler } from "./lib";

const terminal = ref<HTMLElement | null>(null);
const fitAddon = new FitAddon();
const xterm = new Terminal({ cursorBlink: true, disableStdin: false });
xterm.loadAddon(fitAddon);

onMounted(async () => {
  xterm.open(terminal.value as HTMLElement);
  fitAddon.fit();
  xterm.write("~$ ");
  injectInputHanlder(xterm);
  injectCombinationKeyHandler(xterm);
  window.ipcRenderer.on("shell", (_event, data) => {
    xterm.write(data);
  });
});
</script>

<template>
  <div class="terminal-page">
    <div ref="terminal" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style lang="scss" scoped>
.terminal-page {
  width: 100%;
  height: 100%;
}
</style>
