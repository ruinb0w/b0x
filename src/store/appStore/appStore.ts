import type { App } from "@/type";
import { defineStore } from "pinia";
import { ref } from "vue";
import { APPS } from "@/config";

export const useAppStore = defineStore("app", () => {
  const apps = ref(APPS);
  const current = ref(APPS[0]);

  function switchCurrent(id: number) {
    const target = apps.value.find((app) => app.id == id);
    if (!target) return;
    current.value = target;
  }

  window.ipcRenderer.on("switch-app", (_e, index: number) => {
    const target = apps.value[index];
    if (!target) return;
    current.value = target;
  });

  return {
    apps,
    current,
    switchCurrent,
  };
});
