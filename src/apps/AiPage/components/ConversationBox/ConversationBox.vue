<script setup lang="ts">
import type { Conversation } from "../../type";
import MarkdownPreview from "@/components/MarkdownPreview/MarkdownPreview.vue";

const message = defineModel<string>();
defineProps<{ conversation?: Conversation }>();
const emits = defineEmits(["send"]);
</script>

<template>
  <div class="conversation-box">
    <div class="messages">
      <el-card
        class="message"
        v-for="message in conversation?.messages"
        :key="message.content"
        shadow="never"
      >
        <template #header>
          <div :class="['role', message.role]">
            {{ message.role }}
          </div>
        </template>
        <markdown-preview :raw-data="message.content" />
      </el-card>
      <el-empty
        description="input some to start conversation"
        v-if="!conversation?.messages.length"
      />
    </div>
    <div class="message-box">
      <el-input v-model="message" />
      <el-button :type="message?.length ? 'primary' : ''" @click="emits('send')">发送</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.conversation-box {
  display: flex;
  flex-direction: column;
  .messages {
    flex: 1;
    overflow: auto;
    .message {
      margin-bottom: 10px;
      .role.user {
        color: #409eff;
      }
      .role.assistant {
        color: #67c23a;
      }
    }
  }
  .message-box {
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
