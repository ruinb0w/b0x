<script setup lang="ts">
import { useTabsStore } from "../../store/tabs/tabs";
import { useWeb } from "./lib";
import SearchBar from "./components/SearchBar/SearchBar.vue";
import PageNavigator from "./components/PageNavigator/PageNavigator.vue";
import TabBar from "../../components/TabBar/TabBar.vue";

const tabStore = useTabsStore();
const web = useWeb(tabStore);
</script>

<template>
  <div class="web-page">
    <div class="header-bar">
      <page-navigator class="p-n" @back="web.handleBack" @forward="web.handleForward" />
      <search-bar class="s-b" v-model="web.urlContent.value" @active="web.handleOpen" />
      <search-bar
        class="content-search"
        v-model="web.searchContent.value"
        v-show="web.showSearch.value"
        @active="web.handleSearch"
      />
    </div>
    <div class="main-container">
      <tab-bar
        class="t-b"
        :current="tabStore.current"
        :list="tabStore.tabs"
        @switch="web.handleSwtichTab"
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
