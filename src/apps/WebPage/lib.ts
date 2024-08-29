interface Web {
  goBack(): void;
  goForward(): void;
  findInPage(text: string, options?: { findNext: boolean }): void;
  stopFindInPage(action: "clearSelection"): void;
}
import type { KeyboardEvent } from "@/type";
import type { HandlerDetails } from "electron";
import type { useTabsStore } from "@/store/tabs/tabs";
import { ref } from "vue";
import { OFFICE } from "@/config";

export function isIgnore(url: string) {
  const IGNORE_REF_LIST = [...OFFICE.URLS];

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
    const webview = document.querySelector(`#web-${tabStore.current}`);
    //@ts-ignore
    webview?.openDevTools();
  });

  function toggleSearch() {
    if (showSearch.value) {
      const id = `#web-${tabStore.current}`;
      const web = document.querySelector(id) as unknown as Web;
      web.stopFindInPage("clearSelection");
    }
    showSearch.value = !showSearch.value;
  }

  function handleBack() {
    const id = `#web-${tabStore.current}`;
    const web = document.querySelector(id) as unknown as Web;
    web.goBack();
  }

  function handleSwtichTab(id: number) {
    tabStore.switchTab(id, () => {
      const currentWeb = tabStore.tabs.find((id) => id == id);
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
    toggleSearch,
  };
}

export function useTab() {}

export function usePreloadPath() {
  const path = ref("");

  window.ipcRenderer.on("get-file-path", (_ev, data) => {
    path.value = data;
  });

  function reuqestPreloadPath() {
    window.ipcRenderer.send("get-file-path", "webpage_preload.js");
  }

  return { path, reuqestPreloadPath };
}

export function useShortcuts(
  tabStore: ReturnType<typeof useTabsStore>,
  web: ReturnType<typeof useWeb>
) {
  function handleKeydown(_: any, data: KeyboardEvent) {
    if (!data.ctrlKey) return;
    if (Number(data.key) > 0) {
      const id = tabStore.tabs?.[Number(data.key) - 1]?.id;
      id && tabStore.switchTab(id);
    } else if (data.key == "w") {
      tabStore.current && tabStore.remove(tabStore.current);
    } else if (data.key == "f") {
      web.toggleSearch();
    }
  }

  function listenShortcuts() {
    window.ipcRenderer.on("webview-keydown", handleKeydown);
  }
  function unlistenShortcuts() {
    window.ipcRenderer.off("webview-keydown", handleKeydown);
  }

  return {
    handleKeydown,
    listenShortcuts,
    unlistenShortcuts,
  };
}
