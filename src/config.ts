import type { App } from "./type";

export const APPS: App[] = [
  { id: 1, name: "Web", path: "/web", componentPath: "WebPage/WebPage" },
  { id: 2, name: "Terminal", path: "/terminal", componentPath: "TerminalPage/TerminalPage" },
  { id: 3, name: "AI", path: "/ai", componentPath: "AiPage/AiPage" },
  { id: 4, name: "Office", path: "/office", componentPath: "OfficePage/OfficePage" },
  { id: 5, name: "File", path: "/file", componentPath: "FileExplorer/FileExplorer" },
];

export const AI_CONFIGS = {
  QW: {
    URL: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    TOKEN: "sk-d66e79d5111843c19788a84fc6d9b2cb",
  },
};
