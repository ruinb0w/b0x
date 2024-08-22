// import { useRouter } from "vue-router";
import { useHooksRegister } from "@/libs/hooksRegister";
import { defineStore } from "pinia";
import { ref } from "vue";
import { APPS } from "@/config";

export const useComponentsStore = function () {
  const hooksRegister = useHooksRegister();
  // const router = useRouter();

  return defineStore("components", () => {
    const apps = ref(APPS);
    const current = ref<number>(1);

    function switchApp(id: number) {
      const app = apps.value.find((app) => app.id == id);
      if (!app) return;
      current.value = app.id;
      hooksRegister.runHooks("onSwitchComponent");
      console.log("switchApp");
      // router.push(app.path);
    }

    window.ipcRenderer.on("switch-app", (_event, id) => {
      console.log("switchApp", id);
      switchApp(id);
    });

    return {
      apps,
      current,
      switchApp,
      onSwitchComponent: (fn: () => void) => hooksRegister.register("onSwitchComponent", fn),
    };
  })();
};
