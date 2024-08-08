import type { FSWatcher } from "node:fs";

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createFilter } from "@rollup/pluginutils";

interface Options {
  dir: string;
  distDir: string;
  include: string[];
  exclude: string[];
}

// 定义插件
export function vitePluginElectronTs(options: Options) {
  const filter = createFilter(options.include, options.exclude);
  let watcher: FSWatcher | null;

  return {
    name: "vite-plugin-electron-ts",
    configResolved() {
      // 用于监听文件变化
      watcher = fs.watch(options.dir, { recursive: true }, (eventType, filename) => {
        if (eventType === "change") {
          rebuild(filename);
        }
      });
    },
    buildStart() {
      rebuild(null);
    },
    buildEnd() {
      if (watcher) {
        watcher.close();
      }
    },
  };

  function rebuild(filename: string | null) {
    let filesToCompile: string[] = [];

    if (filename) {
      filesToCompile.push(filename);
    } else {
      filesToCompile = readDirRecursively(options.dir);
    }

    for (const file of filesToCompile) {
      if (filter(file)) {
        // 没有指定filename时, readDirRecursively会返回带options.dir的路径, 所以不需要再join
        const sourceFile = filename ? path.join(options.dir, file) : file;
        const targetFile = path.join(options.distDir, file.replace(/\.ts$/, ".js"));
        // console.log(sourceFile);

        const targetDir = path.dirname(targetFile);
        fs.mkdirSync(targetDir, { recursive: true });

        const result = ts.transpileModule(fs.readFileSync(sourceFile, "utf-8"), {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
            outDir: options.distDir,
          },
          fileName: sourceFile,
        });
        fs.writeFileSync(targetFile, result.outputText);
      }
    }
  }

  function readDirRecursively(dirPath: string) {
    let filesToCompile: string[] = [];

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      console.log({ dirPath, file });
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const tmp = readDirRecursively(filePath); // 递归进入子目录
        filesToCompile = [...filesToCompile, ...tmp];
      } else if (filePath.endsWith(".ts") && filter(file)) {
        console.log({ filePath });
        filesToCompile.push(filePath); // 如果是 .ts 文件，则添加到列表
      }
    }

    return filesToCompile;
  }
}
