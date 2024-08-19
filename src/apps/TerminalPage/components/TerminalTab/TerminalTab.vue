<script setup lang="ts">
import type { Xterm } from "../../lib";

defineProps<{ terminals: Xterm[]; current: Xterm | undefined }>();
const emits = defineEmits(["create", "remove", "switch"]);
</script>

<template>
  <div class="terminal-tab">
    <i class="tab iconfont icon-27CIRCLE" @click="emits('create')"></i>
    <div
      v-for="(item, i) in terminals"
      :key="i"
      :class="['tab', { active: current?.pid == item.pid }]"
    >
      <div class="title" @click="emits('switch', item.pid)">{{ item.title }}</div>
      <i class="iconfont icon-close" @click="emits('remove', item.pid)"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.terminal-tab {
  display: flex;
  border-top: 1px solid #999;
  .tab {
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    margin-left: 10px;
    .title {
      white-space: nowrap;
      max-width: 10rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .iconfont {
      flex-shrink: 0;
      padding: 0.4rem;
    }
    .iconfont:hover {
      opacity: 0.6;
    }
  }
  .tab.active {
    text-shadow: 0.25px 0px 0.1px, -0.25px 0px 0.1px;
  }
  .tab.iconfont {
    font-size: 1rem;
  }
}
</style>
