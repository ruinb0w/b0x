<script setup lang="ts">
const emits = defineEmits(["close", "switch"]);
defineProps<{ current: number | null; list: { icon: string; name: string; id: number }[] }>();
</script>

<template>
  <div class="tab-bar">
    <div class="tab-box">
      <div
        :class="['tab', { active: current === tab.id }]"
        v-for="tab in list"
        :key="tab.id"
        @click="emits('switch', tab.id)"
      >
        <img :src="tab.icon || ''" class="icon" />
        <div class="name">{{ tab.name }}</div>
        <el-icon @click="emits('close', tab.id)"><Close /></el-icon>
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
        border-radius: 50px;
        background: #ffffff;
        box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
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
