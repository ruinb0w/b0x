<script setup lang="ts">
import { usePlguinStore } from "../../store/plugins/plugins";
import { APPS } from "../../config";
import { useComponentsStore } from "../../store/components/components";

const componentsStore = useComponentsStore();
const pluginStore = usePlguinStore();

function handleFull() {
  window.ipcRenderer.emit("full-screen");
}
</script>

<template>
  <div class="header-bar">
    <div class="left">
      <div
        class="func"
        v-for="plugin in pluginStore.FIXED_PLUGINS"
        :key="plugin.id"
        @click="pluginStore.activePlugin(plugin.id)"
      >
        <i class="iconfont icon-search" />
      </div>
      <div
        :class="['func', { active: componentsStore.current == app.id }]"
        v-for="app in APPS"
        :key="app.id"
        @click="componentsStore.switchApp(app.id)"
      >
        {{ app.name }}
      </div>
    </div>
    <div class="right">
      <div class="btn">-</div>
      <div class="btn" @click="handleFull">+</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-bar {
  -webkit-app-region: drag;
  user-select: none;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    -webkit-app-region: none;
    .func {
      padding: 10px;
      cursor: pointer;
    }
    .func.active {
      text-shadow: 0.25px 0px 0.1px, -0.25px 0px 0.1px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .btn {
      padding: 0 10px;
    }
  }
}
</style>
