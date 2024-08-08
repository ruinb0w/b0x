<script setup lang="ts">
import ConversationList from "./components/ConversationList/ConversationList.vue";
import ConversationBox from "./components/ConversationBox/ConversationBox.vue";
</script>

<template>
  <div class="ai-page">
    <conversation-list class="c-l" />
    <conversation-box class="c-b" />
  </div>
</template>

<style lang="scss" scoped>
.ai-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  .c-l,
  .c-b {
    height: 100%;
    padding: 10px;
    border-radius: 10px;
    box-sizing: border-box;
    background: #fff;
  }
  .c-l {
    flex: 1;
    margin-right: 10px;
  }
  .c-b {
    flex: 4;
  }
}
</style>
