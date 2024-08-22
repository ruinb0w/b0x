<script setup lang="ts">
import { usePlguinStore } from "../../store/plugins/plugins";
// import { Plugins } from "../../config";
import { useAppStore } from "@/store/appStore/appStore";

const appStore = useAppStore();
const pluginStore = usePlguinStore();
</script>

<template>
  <div class="header-bar">
    <div class="apps">
      <div
        class="app"
        v-for="plugin in pluginStore.FIXED_PLUGINS"
        :key="plugin.id"
        @click="pluginStore.activePlugin(plugin.id)"
      >
        <i class="iconfont icon-search" />
      </div>
      <div
        v-for="app in appStore.apps"
        :key="app.id"
        :class="['app', { active: appStore.current.id == app.id }]"
        @click="appStore.switchCurrent(app.id)"
      >
        {{ app.name }}
      </div>
    </div>
    <div class="plugins">
      <div class="plugin" v-for="plugin in pluginStore.plugins" :key="plugin.id">
        <i :class="['iconfont', plugin.icon]"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-bar {
  -webkit-app-region: drag;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .apps,
  .plugins {
    display: flex;
    align-items: center;
    -webkit-app-region: none;
  }
  .apps {
    .app {
      padding: 10px;
      cursor: pointer;
    }
    .app.active {
      text-shadow: 0.25px 0px 0.1px, -0.25px 0px 0.1px;
    }
  }
}
</style>
