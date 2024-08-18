<script setup lang="ts">
import { usePlguinStore } from "../../store/plugins/plugins";
import { APPS, Plugins } from "../../config";
import { useComponentsStore } from "../../store/components/components";

const componentsStore = useComponentsStore();
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
        :class="['app', { active: componentsStore.current == app.id }]"
        v-for="app in APPS"
        :key="app.id"
        @click="componentsStore.switchApp(app.id)"
      >
        {{ app.name }}
      </div>
    </div>
    <div class="plugins">
      <div class="plugin" v-for="plugin in Plugins" :key="plugin.id">
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
