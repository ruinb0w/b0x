<script setup lang="ts">
import { marked } from "marked";

defineProps<{ rawData: string }>();
</script>

<template>
  <div class="markdown-preview">
    <div class="markdown" v-html="marked(rawData)"></div>
  </div>
</template>

<style lang="scss" scoped></style>
