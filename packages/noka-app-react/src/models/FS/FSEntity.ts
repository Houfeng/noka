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

  /**
   * 当前 Entity 相对于 FSLibrary.root 的相对路径
   */
  get path() {
    return normalize(this.info.path);
  }

  /**
   * 当前 entity 在本机系统中的绝对路径
   */
  get fullPath() {
    return normalize(`${this.root}/${this.info.path}`);
  }

  /**
   * 通过子路径获取一个子 entity，支持深层获取，比如 /a/b/c
   * @param subPath 子路径
   * @returns
   */
  async child(subPath: string): Promise<FSEntity | undefined> {
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

  /**
   * 获取当前 entity 的所有直属子级
   * @returns 直属性子级列表
   */
  async children(): Promise<FSEntity[]> {
    if (this.info.type !== "folder") return [];
    const items = (await readdir(normalize(this.fullPath))).filter(
      (it) => !it.startsWith(".") && !it.startsWith("~"),
    );
    return Promise.all(items.map((it) => this.child(it) as Promise<FSEntity>));
  }

  /**
   * 过滤出所有符合条件的 entities
   * @param fn 过滤函数
   * @returns
   */
  async filter(fn: (entity: FSEntity) => boolean): Promise<FSEntity[]> {
    const children = await this.children();
    const items = children.filter(fn);
    const subItems = (
      await Promise.all(items.map((it) => it.filter(fn)))
    ).reduce((list, subList) => [...list, ...subList], []);
    return [...items, ...subItems];
  }

  /**
   * 查看第一个符合条件的 entities
   * @param fn 过滤函数
   * @returns
   */
  async find(fn: (entity: FSEntity) => boolean): Promise<FSEntity | undefined> {
    const children = await this.children();
    const item = children.find(fn);
    if (item) return item;
    for (const child of children) {
      const subItem = await child.find(fn);
      if (subItem) return subItem;
    }
  }

  /**
   * 用于 JSON.stringify 后的格式
   * @returns 可 stringify 的简单对象
   */
  toJSON() {
    return this.info;
  }
}
