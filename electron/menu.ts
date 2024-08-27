import { Menu } from "electron";

export function createMenu(win: Electron.BrowserWindow) {
  const MENU_TEMPLATE = [
    {
      label: "Shortcuts",
      submenu: [
        {
          label: "search",
          accelerator: "CommandOrControl+Alt+`",
          click: () => {
            win.webContents.send("active-plugin", "search");
          },
        },
        {
          label: "esc",
          accelerator: "Escape",
          click: () => {
            win.webContents.send("active-plugin", "esc");
          },
        },
        {
          label: "electron-dev-tool",
          accelerator: "Shift+F12",
          click: () => win.webContents.toggleDevTools(),
        },
        {
          label: "webview-dev-tool",
          accelerator: "F12",
          click: () => win.webContents.send("dev-tool"),
        },
      ],
    },
    // {
    //   label: "App",
    //   submenu: Array.from({ length: 9 }, (_, i) => i).map((i) => {
    //     console.log(i);
    //     return {
    //       label: `app-${i}`,
    //       accelerator: `Shift+${i}`,
    //       click: () => {
    //         win.webContents.send("switch-app", i - 1);
    //       },
    //     };
    //   }),
    // },
  ];
  const menu = Menu.buildFromTemplate(MENU_TEMPLATE);
  Menu.setApplicationMenu(menu);
}
