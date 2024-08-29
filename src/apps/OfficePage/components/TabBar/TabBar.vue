<script setup lang="ts">
import type { Tab } from "../../type";

defineProps<{ tabs: Tab[]; current: Tab }>();
const emits = defineEmits(["active", "close"]);
</script>

<template>
  <div class="tab-bar">
    <el-tag
      class="tab"
      v-for="tab in tabs"
      :key="tab.id"
      @click="emits('active', tab.id)"
      :effect="current.id == tab.id ? 'dark' : 'plain'"
      :closable="tab.id != 1"
      @close="$emit('close', tab.id)"
    >
      {{ tab.title }}
    </el-tag>
  </div>
</template>

<style lang="scss" scoped>
.tab-bar {
  display: flex;
  align-items: center;
  .tab {
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
