<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "@xterm/xterm/lib/xterm.js";
import { injectInputHanlder, injectCombinationKeyHandler } from "./lib";

const terminal = ref<HTMLElement | null>(null);
const xterm = new Terminal({ cursorBlink: true, disableStdin: false });

onMounted(async () => {
  xterm.open(terminal.value as HTMLElement);
  xterm.write("~$ ");
  injectInputHanlder(xterm);
  injectCombinationKeyHandler(xterm);
  window.ipcRenderer.on("pty", (_event, data) => {
    console.log("pty", data);
  });
});
</script>

<template>
  <div class="terminal-page">
    <div ref="terminal"></div>
  </div>
</template>

<style lang="scss" scoped></style>
