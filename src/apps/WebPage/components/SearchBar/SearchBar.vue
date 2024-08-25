<script setup lang="ts">
import { ElInput } from "element-plus";
// import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

const searchContent = defineModel<string>();
const emits = defineEmits(["active"]);

// function handleKeyUp(_event: any) {
//   window.open(`https://www.google.com/search?q=${searchContent.value}`);
// }

function handleActive(event: { key: string }) {
  if (event.key != "Enter") return;
  emits("active", searchContent.value);
}
</script>

<template>
  <div class="search-bar">
    <el-input
      v-model="searchContent"
      :prefix-icon="Search"
      @keyup="handleActive($event)"
      autofocus
    />
  </div>
</template>

<style lang="scss" scoped></style>
