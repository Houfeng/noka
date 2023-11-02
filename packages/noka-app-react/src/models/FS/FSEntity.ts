import { existsSync } from "fs";
import { readdir, stat } from "fs/promises";
import { basename, normalize } from "path";

export type FSEntityInfo = {
  type: "folder" | "file";
  name: string;
  path: string;
  size?: number;
  ctime?: number;
  mtime?: number;
};

export class FSEntity {
  constructor(
    public root: string,
    public info: FSEntityInfo,
  ) {}

  get path() {
    return normalize(this.info.path);
  }

  get fullPath() {
    return normalize(`${this.root}/${this.info.path}`);
  }

  async child(subPath: string) {
    const path = normalize(`${this.info.path}/${subPath}`);
    const fullPath = normalize(`${this.root}/${path}`);
    if (!existsSync(fullPath)) return;
    const statInfo = await stat(fullPath);
    if (!statInfo.isDirectory() && !statInfo.isFile()) return;
    const type = statInfo?.isDirectory?.() ? "folder" : "file";
    const name = basename(path) || "";
    const size = statInfo.size;
    const ctime = statInfo.ctime.getTime();
    const mtime = statInfo.mtime.getTime();
    const info: FSEntityInfo = { type, name, path, size, ctime, mtime };
    return new FSEntity(this.root, info);
  }

  async children() {
    if (this.info.type !== "folder") return [];
    const items = (await readdir(normalize(this.fullPath))).filter(
      (it) => !it.startsWith(".") && !it.startsWith("~"),
    );
    return Promise.all(items.map((name) => this.child(name)));
  }

  toJSON() {
    return this.info;
  }
}
