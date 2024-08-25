interface Web {
  goBack(): void;
  goForward(): void;
  findInPage(text: string, options?: { findNext: boolean }): void;
  stopFindInPage(action: "clearSelection"): void;
}

import type { HandlerDetails } from "electron";
import type { useTabsStore } from "@/store/tabs/tabs";
import { ref } from "vue";

export function isIgnore(url: string) {
  const IGNORE_REF_LIST = ["365.kdocs.cn"];

  return IGNORE_REF_LIST.some((item) => {
    return url.includes(item);
  });
}

export function useWeb(tabStore: ReturnType<typeof useTabsStore>) {
  const searchContent = ref("");
  const urlContent = ref("");
  const showSearch = ref(false);

  window.ipcRenderer.on("new-window", (_event, detail: HandlerDetails) => {
    if (isIgnore(detail.referrer.url)) return;
    tabStore.append({ icon: "", name: "", path: detail.url });
  });
  window.ipcRenderer.on("dev-tool", () => {
    console.log("dev-tool");
    const webview = document.querySelector(`#web-${tabStore.current}`);
    //@ts-ignore
    webview?.openDevTools();
  });

  window.ipcRenderer.on("page-search", () => {
    if (showSearch.value) {
      const id = `#web-${tabStore.current}`;
      const web = document.querySelector(id) as unknown as Web;
      web.stopFindInPage("clearSelection");
    }
    showSearch.value = !showSearch.value;
  });

  function handleBack() {
    const id = `#web-${tabStore.current}`;
    const web = document.querySelector(id) as unknown as Web;
    web.goBack();
  }

  function handleSwtichTab(id: number) {
    tabStore.switchTab(id, () => {
      const currentWeb = tabStore.tabs.find((id) => id == id);
      console.log("currentWeb", currentWeb);
      urlContent.value = currentWeb?.path || "";
    });
  }

  function handleForward() {
    const id = `#web-${tabStore.current}`;
    const web = document.querySelector(id) as unknown as Web;
    web.goForward();
  }

  function handleOpen(content: string) {
    if (content.includes("http")) {
      window.open(content);
    } else {
      window.open(`https://www.google.com/search?q=${content}`);
    }
  }

  function handleSearch(content: string) {
    const id = `#web-${tabStore.current}`;
    const web = document.querySelector(id) as unknown as Web;
    const result = web.findInPage(content, { findNext: true });
    console.log("result", result);
  }

  return {
    handleBack,
    handleSwtichTab,
    handleForward,
    urlContent,
    searchContent,
    showSearch,
    handleOpen,
    handleSearch,
  };
}
