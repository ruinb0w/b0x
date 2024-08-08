<script setup lang="ts">
import type { Tab } from "../../store/tabs/type";
import { useTabsStore } from "../../store/tabs/tabs";

const tabStore = useTabsStore();

function switchTab(id: number) {
  tabStore.switchTab(id);
}
</script>

<template>
  <div class="tab-bar">
    <div class="tab-box">
      <div
        :class="['tab', { active: tabStore.current === tab.id }]"
        v-for="tab in tabStore.tabs"
        :key="tab.id"
        @click="switchTab(tab.id)"
      >
        <img :src="tab.icon || ''" class="icon" />
        <div class="name">{{ tab.name }}</div>
        <i class="iconfont icon-guanbi"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-bar {
  position: relative;
  z-index: 9;
  width: 30px;
  .tab-box {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    background: #f7f8f9;
    .tab {
      white-space: nowrap;
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      display: flex;
      .name {
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
      }
      .icon {
        width: 20px;
        height: 20px;
        padding: 4px;
        margin-right: 6px;
      }
    }
    .tab.active {
      background: #fff;
    }
  }
}
.tab-bar:hover {
  .tab-box {
    width: 200px;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
  }
}
</style>
