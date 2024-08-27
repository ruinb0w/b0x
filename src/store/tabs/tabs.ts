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
            const tab = tabs.value.find((tab) => tab.id === id);
            if (!tab) return;
            //@ts-ignore
            tab.icon = data.favicons[0];
          },
          { once: true }
        );
        //@ts-ignore
        web?.getWebContents().on("before-input-event", (event, input) => {
          if (input.type !== "keyDown") return;

          // Create a fake KeyboardEvent from the data provided
          const emulatedKeyboardEvent = new KeyboardEvent("keydown", {
            code: input.code,
            key: input.key,
            shiftKey: input.shift,
            altKey: input.alt,
            ctrlKey: input.control,
            metaKey: input.meta,
            repeat: input.isAutoRepeat,
          });

          // do something with the event as before
        });
      });
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
      // hooksRegister.runHooks("onSwitchTab");
      cb && cb();
    }

    window.ipcRenderer.on("close-tab", () => {
      current.value && remove(current.value);
    });

    window.ipcRenderer.on("switch-tab", (_e, index: number) => {
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
