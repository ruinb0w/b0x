<script setup lang="ts">
import TabBar from "./components/TabBar/TabBar.vue";
import { useOffice } from "./lib";

const office = useOffice();
</script>

<template>
  <div class="office-page">
    <tab-bar
      class="t-b"
      :tabs="office.tabs.value"
      @active="office.switchTab"
      :current="office.currentTab.value"
      @close="office.removeTab"
    />
    <div class="web-container">
      <webview
        v-for="tab in office.tabs.value"
        :key="tab.id"
        v-show="office.currentTab.value.id == tab.id"
        :class="['web', `office-${tab.id}`]"
        :src="tab.url"
        allowpopups
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.office-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #eee;
  .t-b {
    padding: 10px;
    border-bottom: 1px solid #cdd0d6;
  }
  .web-container {
    flex: 1;
    .web {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
