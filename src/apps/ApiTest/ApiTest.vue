<script setup lang="ts"></script>

<template>
  <div class="api-test">
    <webview src="https://apifox.com/" />
  </div>
</template>

<style lang="scss" scoped>
.api-test {
  width: 100%;
  height: 100%;
  webview {
    width: 100%;
    height: 100%;
  }
}
</style>
