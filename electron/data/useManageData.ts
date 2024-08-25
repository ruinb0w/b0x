import { ipcMain } from "electron";
import { readFile, writeFile, existsSync } from "fs";
import { join } from "path";

export function useManageData() {
  ipcMain.on("get-data", (event, dbName: string) => {
    console.log("get-data", dbName);
    if (!dbName) return false;
    event.reply("get-data", getData(dbName));
  });

  ipcMain.on("set-data", (event, data) => {
    const result = setData(data);
    event.reply("set-data", result);
  });

  function getData(dbName: string) {
    if (!dbName) return;
    const filePath = join(__dirname, `./${dbName}.json`);
    if (!existsSync(filePath)) {
      writeFile(filePath, "{}", (err) => {
        if (err) {
          console.log("err", err);
          return false;
        }
      });
    }
    readFile(filePath, { encoding: "utf8" }, (err, data) => {
      if (err) {
        console.log("err", err);
        return false;
      }
      try {
        return JSON.parse(data);
      } catch (err) {
        console.log("err", err);
        return false;
      }
    });
  }

  function setData(data: { dbName: string; data: any }) {
    if (!data.dbName) return;
    const stringifyData = JSON.stringify(data.data);
    writeFile(join(__dirname, `./${data.dbName}.json`), stringifyData, (err) => {
      if (err) {
        console.log("err", err);
        return false;
      }
      return true;
    });
  }
}
