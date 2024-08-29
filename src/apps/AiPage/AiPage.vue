<script setup lang="ts">
import ConversationList from "./components/ConversationList/ConversationList.vue";
import ConversationBox from "./components/ConversationBox/ConversationBox.vue";
import { onMounted } from "vue";
import { useChat, askQw } from "./lib";

const chat = useChat(askQw);
onMounted(() => {
  if (!chat.currentConversation.value) {
    chat.createConversation();
  }
});
</script>

<template>
  <div class="ai-page">
    <conversation-list
      class="c-l"
      :conversation-list="chat.conversationList.value"
      :current-conversation="chat.currentConversation.value"
      @create="chat.createConversation"
      @close="chat.removeConversation"
      @switch="chat.switchCurrent"
    />
    <conversation-box
      class="c-b"
      :conversation="chat.currentConversation.value"
      @send="chat.makeQuestion"
      v-model="chat.message.value"
    />
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
    overflow: hidden;
    max-width: 200px;
  }
  .c-b {
    flex: 4;
  }
}
</style>
