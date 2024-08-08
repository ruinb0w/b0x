import { getInstalledApps } from "get-installed-apps";

export function getApps() {
  return new Promise((resolve) => {
    getInstalledApps().then((apps) => {
      resolve(apps);
    });
  });
}
