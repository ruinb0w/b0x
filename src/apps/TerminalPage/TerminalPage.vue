<script setup lang="ts">
import { onMounted } from "vue";
import { useXterm } from "./lib";
import { TERMINAL_CONF } from "@/config";
import TerminalTab from "./components/TerminalTab/TerminalTab.vue";

const xterm = useXterm();

onMounted(() => {
  xterm.createPty();
});
</script>

<template>
  <div class="terminal-page">
    <terminal-tab
      @create="xterm.createPty"
      @switch="xterm.switchCurrent"
      @remove="xterm.removePty"
      :terminals="xterm.terminals.value"
      :current="xterm.current.value"
    />
    <div class="terminal-wrapper" :style="`background: ${TERMINAL_CONF.theme?.background}`">
      <div
        v-for="item in xterm.terminals.value"
        v-show="xterm.current.value?.pid == item.pid"
        :key="item.pid"
        :class="['terminal-container', `pid-${item.pid}`]"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.terminal-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .terminal-wrapper {
    flex: 1;
    overflow: hidden;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    .terminal-container {
      flex: 1;
    }
  }
}
</style>
