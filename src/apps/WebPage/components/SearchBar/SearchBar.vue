<script setup lang="ts">
import { ElInput } from "element-plus";
// import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

const searchContent = defineModel<string>();

function handleKeyUp(_event: any) {
  if (_event.key != "Enter") return;
  window.open(`https://www.google.com/search?q=${searchContent.value}`);
}
</script>

<template>
  <div class="search-bar">
    <el-input v-model="searchContent" :prefix-icon="Search" @keyup="handleKeyUp" />
  </div>
</template>

<style lang="scss" scoped></style>
