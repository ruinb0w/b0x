import type { Tab, RawTab } from "./type";
// import { useHooksRegister } from "../../libs/hooksRegister";
import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useTabsStore = function () {
  // const hooksRegister = useHooksRegister();

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
      const targetIndex = tabs.value.findIndex((tab) => tab.id == id);
      if (targetIndex == -1) return;
      tabs.value.splice(targetIndex, 1);
      const prevIndex = targetIndex >= 1 ? targetIndex - 1 : 0;
      console.log("remove", id, prevIndex);
      switchTab(tabs.value[prevIndex].id);
    }

    function switchTab(id: number, cb?: () => void) {
      if (!tabs.value.find((tab) => tab.id == id)) return;
      current.value = id;
      // hooksRegister.runHooks("onSwitchTab");
      cb && cb();
    }

    window.ipcRenderer.on("close-tab", () => {
      console.log("closetab");
      current.value && remove(current.value);
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
      // onSwitchTab: (fn: () => void) => hooksRegister.register("onSwitchTab", fn),
    };
  })();
};
