<script setup lang="ts">
const emits = defineEmits(["back", "refresh", "forward"]);
</script>

<template>
  <div class="page-navigator">
    <el-icon @click="emits('back')"><ArrowLeftBold /></el-icon>
    <el-icon @click="emits('refresh')"><RefreshRight /></el-icon>
    <el-icon @click="emits('forward')"><ArrowRightBold /></el-icon>
  </div>
</template>

<style lang="scss" scoped>
.page-navigator {
  .el-icon {
    cursor: pointer;
  }
}
</style>
