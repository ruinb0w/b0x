import "./style.css";
import "./assets/iconfont.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia).use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app").$nextTick(() => {
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
});
