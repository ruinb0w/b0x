<script setup lang="ts">
import TabBar from "../../components/TabBar/TabBar.vue";
import { useTabsStore } from "../../store/tabs/tabs";

const tabStore = useTabsStore();

window.ipcRenderer.on("new-window", (_event, url: string) => {
  tabStore.append({ icon: "", name: "", path: url });
});

window.ipcRenderer.on("dev-tool", () => {
  const webview = document.querySelector(`#web-${tabStore.current}`);
  //@ts-ignore
  webview?.openDevTools();
});
</script>

<template>
  <div class="web-page">
    <tab-bar class="t-b" />
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
</template>

<style lang="scss" scoped>
.web-page {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .t-b {
    height: 100%;
  }
  webview {
    width: 100%;
    height: 100%;
  }
}
</style>
