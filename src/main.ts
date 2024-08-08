import "./style.css";
import "./assets/iconfont.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router/router";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia).use(router);
app.mount("#app").$nextTick(() => {
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
});
