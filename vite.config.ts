import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vitePluginElectronTs } from "./plugins/vite-plugin-electron-ts";

const CUSTOM_ELEMENT = ["webview"];

export default defineConfig({
  plugins: [
    vue({
      template: { compilerOptions: { isCustomElement: (tag) => CUSTOM_ELEMENT.includes(tag) } },
    }),
    vitePluginElectronTs({
      include: ["**/*.ts"],
      exclude: ["**/*.d.ts"],
      dir: "electron", // Electron 源代码目录
      distDir: "electron-dist", // 输出目录
    }),
  ],
  server: { host: "0.0.0.0" },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
