import type { Plugin } from "./type";
import { defineStore } from "pinia";
import { ref, defineAsyncComponent, markRaw } from "vue";

export const usePlguinStore = defineStore("plugins", () => {
  const plugins = ref<Plugin[]>([]);
  const current = ref<Plugin | null>();

  function activePlugin(id: number | string) {
    let plugin = FIXED_PLUGINS.find((plugin) => plugin.id == id);
    if (!plugin) plugins.value.find((plugin) => plugin.id == id);
    if (!plugin) {
      return;
    }
    current.value = plugin;
  }

  function unactivePlugin() {
    current.value = null;
  }

  window.ipcRenderer.on("active-plugin", (_event: any, id: string | number) => {
    if (id == "esc") {
      unactivePlugin();
    } else {
      activePlugin(id);
    }
  });

  return {
    plugins,
    current,
    activePlugin,
    unactivePlugin,
    FIXED_PLUGINS,
  };
});

const FIXED_PLUGINS = [
  {
    id: "search",
    name: "search",
    icon: "",
    component: markRaw(
      defineAsyncComponent(() => import("../../components/SearchBox/SearchBox.vue"))
    ),
  },
];
