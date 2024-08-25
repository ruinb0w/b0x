import { defineStore } from "pinia";
import { ref } from "vue";

interface History {
  name: string;
  createTime: number;
  content: any[];
}

export const useHisotyStore = defineStore("chat-history", () => {
  let chatData: { historyList: History[] };
  const historyList = ref<History[]>([]);

  window.ipcRenderer.on("get-data", (_event, data) => {
    console.log("get-data", data);
    if (!data) return;
    chatData = data;
    historyList.value = chatData.historyList;
  });

  function requestChat() {
    window.ipcRenderer.send("get-data", "chat");
  }

  function syncChat() {
    chatData.historyList = historyList.value;
    window.ipcRenderer.send("set-data", { dbName: "chat", data: chatData });
  }

  return { historyList, requestChat, syncChat };
});
