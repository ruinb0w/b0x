<script setup lang="ts">
import type { HandlerDetails } from "electron";
import TabBar from "../../components/TabBar/TabBar.vue";
import { useTabsStore } from "../../store/tabs/tabs";
import SearchBar from "./components/SearchBar/SearchBar.vue";
import PageNavigator from "./components/PageNavigator/PageNavigator.vue";
import { isIgnore } from "./lib";
import { ref } from "vue";

const tabStore = useTabsStore();
const searchContent = ref("");

window.ipcRenderer.on("new-window", (_event, detail: HandlerDetails) => {
  if (isIgnore(detail.referrer.url)) return;
  tabStore.append({ icon: "", name: "", path: detail.url });
});
window.ipcRenderer.on("dev-tool", () => {
  const webview = document.querySelector(`#web-${tabStore.current}`);
  //@ts-ignore
  webview?.openDevTools();
});

function handleBack() {
  const id = `#web-${tabStore.current}`;
  const web = document.querySelector(id);
  //@ts-ignore
  web.goBack();
}

function handleSwtichTab(id: number) {
  tabStore.switchTab(id, () => {
    const currentWeb = tabStore.tabs.find((id) => id == id);
    console.log("currentWeb", currentWeb);
    searchContent.value = currentWeb?.path || "";
  });
}
</script>

<template>
  <div class="web-page">
    <div class="header-bar">
      <page-navigator class="p-n" @back="handleBack" />
      <search-bar class="s-b" v-model="searchContent" />
    </div>
    <div class="main-container">
      <tab-bar
        class="t-b"
        :current="tabStore.current"
        :list="tabStore.tabs"
        @switch="handleSwtichTab"
        @close="tabStore.remove"
      />
      <webview
        v-for="tab in tabStore.tabs"
        v-show="tabStore.current === tab.id"
        :key="tab.id"
        :id="`web-${tab.id}`"
        class="web"
        :src="tab.path"
        allowpopups
      ></webview>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.web-page {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .header-bar {
    display: flex;
    align-items: center;
    width: 100%;
    .s-b {
      flex: 1;
      margin: 5px 10px;
    }
  }
  .main-container {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-between;
    .t-b {
      height: 100%;
    }
    webview {
      flex: 1;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
