import type { Tab } from "./type";
import { ref, nextTick } from "vue";
import { OFFICE } from "@/config";

export function useOffice() {
  const tabs = ref<Tab[]>([{ title: "首页", url: OFFICE.HOME, id: 1 }]);
  const currentTab = ref<Tab>(tabs.value[0]);

  window.ipcRenderer.on("new-window", (_, data) => {
    const match = OFFICE.URLS.some((url) => data.url.includes(url));
    if (!match) return;
    createTab(data.url);
  });

  function createTab(url: string) {
    const id = Date.now();
    tabs.value.push({ title: "", url, id });
    switchTab(id);
    nextTick(() => {
      const web = document.querySelector(`.web.office-${id}`);
      web?.addEventListener("page-title-updated", (data) => {
        const target = tabs.value.find((tab) => tab.id === id);
        if (!target) return;
        //@ts-ignore
        target.title = data.title;
      });
    });
  }

  function switchTab(id: number) {
    const target = tabs.value.find((tab) => tab.id === id);
    if (!target) return;
    currentTab.value = target;
  }

  function removeTab(id: number) {
    const targetIndex = tabs.value.findIndex((tab) => tab.id === id);
    if (targetIndex === -1) return;
    tabs.value.splice(targetIndex, 1);
  }

  return { tabs, currentTab, switchTab, createTab, removeTab };
}
