import { createWebHashHistory, createRouter } from "vue-router";
import type { App } from "@/type";
import { APPS } from "@/config";

// 由于使用了多级目录, 只能通过import.meta.glob获取到apps下的所有组件
const appComponents = import.meta.glob("../apps/**/*.vue");

const routes = [
  {
    path: "/",
    redirect: "/web",
  },
  ...APPS.map((app) => genAppRoute(app)),
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

function genAppRoute(app: App) {
  return {
    path: app.path,
    component: appComponents[`../apps/${app.componentPath}.vue`],
  };
}
