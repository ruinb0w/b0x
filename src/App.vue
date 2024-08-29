<script setup lang="ts">
// import MainView from "./components/MainView/MainView.vue";
import HeaderBar from "./components/HeaderBar/HeaderBar.vue";
import { usePlguinStore } from "./store/plugins/plugins";
import { useAppStore } from "./store/appStore/appStore";

const appStore = useAppStore();
const pluginStore = usePlguinStore();
</script>

<template>
  <div class="app">
    <header-bar />
    <div class="main-content">
      <component
        v-for="app in appStore.apps"
        :key="app.name"
        :is="app.component"
        v-show="app == appStore.current"
        :is-visible="app == appStore.current"
      />
    </div>
  </div>
  <component :is="pluginStore.current?.component"></component>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background: #f7f8f9;
  .main-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
