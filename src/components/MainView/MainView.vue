<script setup lang="ts">
import { useComponentsStore } from "../../store/components/components";
import { ref } from "vue";

const activeType = ref<"web" | "component">("component");
const compoentsStore = useComponentsStore();

compoentsStore.onSwitchComponent(() => {
  activeType.value = "component";
});
</script>

<template>
  <div class="main-view">
    <div class="content">
      <component
        :is="compoentsStore.current?.component"
        v-show="activeType == 'component'"
      ></component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-view {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  padding-left: 0;
  .content {
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    .web {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
