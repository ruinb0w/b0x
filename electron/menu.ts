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
    {
      label: "Web",
      submenu: [
        {
          label: "close",
          accelerator: "CommandOrControl+W",
          click: () => {
            win.webContents.send("close-tab");
          },
        },
        ...Array.from({ length: 5 }, (_, i) => i + 1).map((i) => {
          return {
            label: `tab-${i}`,
            accelerator: `CommandOrControl+${i}`,
            click: () => {
              win.webContents.send("switch-tab", i);
            },
          };
        }),
      ],
    },
    {
      label: "App",
      submenu: Array.from({ length: 5 }, (_, i) => i + 1).map((i) => {
        return {
          label: `app-${i}`,
          accelerator: `CommandOrControl+Alt+${i}`,
          click: () => {
            win.webContents.send("switch-app", i);
          },
        };
      }),
    },
  ];
  const menu = Menu.buildFromTemplate(MENU_TEMPLATE);
  Menu.setApplicationMenu(menu);
}
