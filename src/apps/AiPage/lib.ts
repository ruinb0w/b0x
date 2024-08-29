import type { Conversation, Message } from "./type";
import { AI_CONFIGS } from "@/config";
import { ref } from "vue";

const DEFAULT_TITLE = "新的对话";

export function useChat(
  model: (messages: Message[], processChunk: (chunk: string) => void) => void
) {
  const conversationList = ref<Conversation[]>([]);
  const currentConversation = ref<Conversation>();
  const message = ref("");

  function createConversation() {
    const id = Date.now();
    conversationList.value.push({
      id,
      title: DEFAULT_TITLE,
      messages: [],
    });
    switchCurrent(id);
  }

  function removeConversation(id: number) {
    const index = conversationList.value.findIndex((item) => item.id === id);
    if (index == -1) return;
    conversationList.value.splice(index, 1);
    switchCurrent(conversationList.value[0]?.id);
  }

  function switchCurrent(id: number) {
    currentConversation.value = conversationList.value.find((item) => item.id === id);
  }

  function makeQuestion() {
    if (!currentConversation.value) createConversation();
    if (!currentConversation.value) return;

    if (currentConversation.value.title == DEFAULT_TITLE) {
      currentConversation.value.title = message.value;
    }
    currentConversation.value.messages.push({ content: message.value, role: "user" });
    const messages = currentConversation.value?.messages;
    if (!messages) return;
    messages.push({ content: "", role: "assistant" });
    model(messages, (chunk: string) => {
      messages[messages.length - 1].content += chunk;
    });
    message.value = "";
  }

  return {
    conversationList,
    currentConversation,
    createConversation,
    removeConversation,
    switchCurrent,
    makeQuestion,
    message,
  };
}

export async function askQw(messages: Message[], updateData: (data: string) => void) {
  const res = await fetch(AI_CONFIGS.QW.URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_CONFIGS.QW.TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: AI_CONFIGS.QW.MODEL,
      messages,
      stream: true,
    }),
  }).catch((err) => {
    console.log("err", err);
  });
  if (!res) return;
  const reader = res.body?.getReader();
  if (!reader) return;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      let data = "";
      try {
        data = JSON.parse(chunk.split("data:")[1]).choices[0].delta.content;
      } catch (err) {
        console.log(err);
      }
      console.log("data", data);
      updateData(data);
    }
  } finally {
    reader.releaseLock();
  }
}

// function processChunk(chunk: string) {
//   console.log("Received:", chunk);
// }
