<script setup lang="ts">
import { onMounted } from "vue";
import { useXterm } from "./lib";
import { TERMINAL_CONF } from "@/config";

const xterm = useXterm();

onMounted(() => {
  xterm.createPty();
});
</script>

<template>
  <div class="terminal-page">
    <div class="tabs">
      <i class="tab iconfont icon-27CIRCLE" @click="xterm.createPty"></i>
      <div
        :class="['tab', { active: xterm.current.value?.pid == item.pid }]"
        @click="xterm.switchCurrent(item.pid)"
        v-for="(item, i) in xterm.terminals.value"
        :key="i"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="terminal-wrapper" :style="`background: ${TERMINAL_CONF.theme?.background}`">
      <div
        v-for="(item, i) in xterm.terminals.value"
        v-show="xterm.current.value?.pid == item.pid"
        :key="i"
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
  .tabs {
    display: flex;
    border-top: 1px solid #999;
    .tab {
      padding: 5px 10px;
      cursor: pointer;
      max-width: 10rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.8rem;
    }
    .tab.active {
      text-shadow: 0.25px 0px 0.1px, -0.25px 0px 0.1px;
    }
    .tab.iconfont {
      font-size: 1rem;
    }
  }
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
