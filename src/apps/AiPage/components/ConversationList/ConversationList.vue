<script setup lang="ts">
import type { Conversation } from "../../type";

defineProps<{ conversationList: Conversation[]; currentConversation?: Conversation }>();
const emits = defineEmits(["create", "close", "switch"]);
</script>

<template>
  <div class="conversation-list">
    <el-button @click="emits('create')">
      <el-icon><Plus /></el-icon>
      new conversation
    </el-button>
    <div class="list">
      <el-tag
        v-for="item in conversationList"
        :key="item.id"
        closable
        @close="emits('close', item.id)"
        @click="emits('switch', item.id)"
        :effect="currentConversation?.id == item.id ? 'dark' : 'plain'"
      >
        {{ item.title }}
      </el-tag>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-button {
    width: 100%;
    .el-icon {
      margin-right: 10px;
    }
  }
  .list {
    margin-top: 10px;
    width: 100%;
    .el-tag {
      cursor: pointer;
      width: 100%;
      margin-bottom: 10px;
      :deep(.el-tag__content) {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
