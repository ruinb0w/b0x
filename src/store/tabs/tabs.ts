import type { Tab, RawTab, Hooks } from "./type";
import { useHooksRegister } from "../../libs/hooksRegister";
import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useTabsStore = function (hooks?: Hooks) {
  const hooksRegister = useHooksRegister();

  return defineStore("tabs", () => {
    const tabs = ref<Tab[]>([]);
    const current = ref<null | number>(null);

    function append(tab: RawTab) {
      const id = Date.now();
      tabs.value.push({
        id,
        ...tab,
      });
      switchTab(id);
      nextTick(() => {
        const web = document.querySelector(`#web-${id}`);
        web?.addEventListener(
          "page-title-updated",
          (data) => {
            console.log("page-title-updated", data);
            const tab = tabs.value.find((tab) => tab.id === id);
            if (!tab) return;
            //@ts-ignore
            tab.name = data.title;
          },
          { once: true }
        );
        web?.addEventListener(
          "page-favicon-updated",
          (data) => {
            console.log("page-favicon-updated", data);
            const tab = tabs.value.find((tab) => tab.id === id);
            if (!tab) return;
            //@ts-ignore
            tab.icon = data.favicons[0];
          },
          { once: true }
        );
      });
    }

    function remove(id: number) {
      tabs.value = tabs.value.filter((tab) => tab.id !== id);
    }

    function switchTab(id: number) {
      if (!tabs.value.find((tab) => tab.id == id)) return;
      current.value = id;
      hooksRegister.runHooks("onSwitchTab");
    }

    window.ipcRenderer.on("close-tab", () => {
      console.log("closetab");
      tabs.value = tabs.value.filter((tab) => tab.id != current.value);
    });

    window.ipcRenderer.on("switch-tab", (_e, index: number) => {
      console.log("switchTab", index);
      const tabId = tabs.value?.[index - 1]?.id;
      tabId && switchTab(tabId);
    });

    return {
      tabs,
      current,
      remove,
      append,
      switchTab,
      onSwitchTab: (fn: () => void) => hooksRegister.register("onSwitchTab", fn),
    };
  })();
};
