<script setup lang="ts">
import ShadowBox from "../ShadowBox/ShadowBox.vue";
import { onMounted, ref } from "vue";
import type { App } from "./type";
import { usePlguinStore } from "../../store/plugins/plugins";

const pluginStore = usePlguinStore();
const search = ref("");
const appList = ref<App[]>([]);
const input = ref<{ focus: () => void } | null>(null);

onMounted(() => {
  input.value?.focus();
  //@ts-ignore
  window.ipcRenderer.on("search-app", (_event, apps: App[]) => {
    console.log("apps", apps);
    appList.value = apps.filter((app) => {
      if (
        app.DisplayName.toLowerCase().includes(search.value.toLowerCase()) ||
        app.appIdentifier.toLowerCase().includes(search.value.toLowerCase()) ||
        app.appName.toLowerCase().includes(search.value.toLowerCase())
      ) {
        return true;
      }
    });
    console.log(appList.value);
  });
});

function handleSearch() {
  window.ipcRenderer.send("search-app", search.value);
}

function handleOpen(app: App | "web") {
  if (app == "web") {
    window.open(`https://www.google.com/search?q=${search.value}`);
    pluginStore.unactivePlugin();
    return;
  }
  if (app.DisplayIcon) {
    const path = app.DisplayIcon.match(/([A-Z]:.*exe)/)?.[0];
    if (!path) return;
    console.log(path);
    window.ipcRenderer.send("open-app", path);
    return;
  }
}
</script>

<template>
  <shadow-box>
    <div class="search-box">
      <input
        class="input"
        v-model="search"
        placeholder="Type something"
        @keyup.enter="handleSearch"
        ref="input"
      />
      <div class="selections">
        <div class="item" v-for="app in appList" :key="app.appIdentifier" @click="handleOpen(app)">
          <Menu class="icon" />
          <div class="name">{{ app.DisplayName }}</div>
        </div>
        <div class="item" @click="handleOpen('web')" v-show="search">
          <Menu class="icon" />
          <div class="name">{{ search }}</div>
        </div>
      </div>
    </div>
  </shadow-box>
</template>

<style lang="scss" scoped>
.search-box {
  .input {
    width: 100%;
  }
  .item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    .icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
  }
  .item:hover {
    background-color: var(--el-color-primary-light-9);
  }
}
</style>
