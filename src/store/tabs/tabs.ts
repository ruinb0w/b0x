import type { Tab, RawTab } from "./type";
// import { useHooksRegister } from "../../libs/hooksRegister";
import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useTabsStore = function () {
  // const hooksRegister = useHooksRegister();

  return defineStore("tabs", () => {
    const tabs = ref<Tab[]>([]);
    const current = ref<null | number>(null);

    window.ipcRenderer.on("close-tab", () => {
      current.value && remove(current.value);
    });

    window.ipcRenderer.on("switch-tab", (_e, index: number) => {
      const tabId = tabs.value?.[index - 1]?.id;
      tabId && switchTab(tabId);
    });

    function append(tab: RawTab) {
      const id = Date.now();
      tabs.value.push({
        id,
        ...tab,
      });
      switchTab(id);
      nextTick(() => {
        const web = document.querySelector(`#web-${id}`);
        const tab = tabs.value.find((tab) => tab.id == id);
        if (!tab) return;
        web?.addEventListener("page-title-updated", (data: any) => {
          tab.name = data.title;
        });
        web?.addEventListener("page-favicon-updated", (data: any) => {
          tab.icon = data.favicons[0];
        });
        web?.addEventListener("did-navigate", (data: any) => {
          tab.path = data.url;
        });
      });
    }

    function seperateWindow(id: number) {
      console.log("tabs", tabs.value);
      const target = tabs.value.find((tab) => tab.id == id);
      if (!target) return;
      window.ipcRenderer.send("seperate-window", { url: target.path });
    }

    function remove(id: number) {
      const targetIndex = tabs.value.findIndex((tab) => tab.id == id);
      if (targetIndex == -1) return;
      tabs.value.splice(targetIndex, 1);
      const prevIndex = targetIndex >= 1 ? targetIndex - 1 : 0;
      switchTab(tabs.value[prevIndex].id);
    }

    function switchTab(id: number, cb?: () => void) {
      if (!tabs.value.find((tab) => tab.id == id)) return;
      current.value = id;
      cb && cb();
    }

    return {
      tabs,
      current,
      remove,
      append,
      switchTab,
      seperateWindow,
    };
  })();
};
