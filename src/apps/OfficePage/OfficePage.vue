<script setup lang="ts"></script>

<template>
  <div class="office-page">
    <webview src="https://365.kdocs.cn" />
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
