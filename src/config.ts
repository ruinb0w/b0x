import type { App } from "./type";
import type { ITerminalOptions } from "@xterm/xterm";
import { markRaw, defineAsyncComponent } from "vue";

export const APPS: App[] = [
  {
    id: 1,
    name: "Web",
    path: "/web",
    component: markRaw(defineAsyncComponent(() => import("./apps/WebPage/WebPage.vue"))),
  },
  {
    id: 2,
    name: "Terminal",
    path: "/terminal",
    component: markRaw(defineAsyncComponent(() => import("./apps/TerminalPage/TerminalPage.vue"))),
  },
  {
    id: 3,
    name: "AI",
    path: "/ai",
    component: markRaw(defineAsyncComponent(() => import("./apps/AiPage/AiPage.vue"))),
  },
  {
    id: 4,
    name: "Office",
    path: "/office",
    component: markRaw(defineAsyncComponent(() => import("./apps/OfficePage/OfficePage.vue"))),
  },
  {
    id: 5,
    name: "File",
    path: "/file",
    component: markRaw(defineAsyncComponent(() => import("./apps/FileExplorer/FileExplorer.vue"))),
  },
  {
    id: 6,
    name: "Photo",
    path: "/photo",
    component: markRaw(defineAsyncComponent(() => import("./apps/PsApp/PsApp.vue"))),
  },
  {
    id: 7,
    name: "ApiTest",
    path: "/apitest",
    component: markRaw(defineAsyncComponent(() => import("./apps/ApiTest/ApiTest.vue"))),
  },
];

export const Plugins = [{ id: 1, name: "Todo", icon: "icon-todolist" }];

export const AI_CONFIGS = {
  QW: {
    URL: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    TOKEN: "sk-d66e79d5111843c19788a84fc6d9b2cb",
  },
};

export const TERMINAL_CONF: ITerminalOptions = {
  cursorBlink: true,
  disableStdin: false,
  fontSize: 16,
  fontFamily: "GeistMono Nerd Font",
  theme: { background: "#222835" },
};
