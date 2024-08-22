<script setup lang="ts">
import TabBar from "@/components/TabBar/TabBar.vue";
</script>

<template>
  <div class="office-page">
    <tab-bar />
    <webview src="https://365.kdocs.cn" allowpopups />
  </div>
</template>

<style lang="scss" scoped>
.office-page {
  width: 100%;
  height: 100%;
  webview {
    width: 100%;
    height: 100%;
  }
}
</style>
