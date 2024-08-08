<script setup lang="ts">
import { usePlguinStore } from "../../store/plugins/plugins";

const pluginStore = usePlguinStore();
</script>

<template>
  <div class="shadow-box" @click.self="pluginStore.unactivePlugin">
    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shadow-box {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  .slot {
    overflow: hidden;
    min-width: 600px;
    min-height: 400px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }
}
</style>
