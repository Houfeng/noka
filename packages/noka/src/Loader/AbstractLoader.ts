import globby from "globby";
import { ApplicationLike } from "../Application/ApplicationLike";
import { LoaderInstance } from "./LoaderInstance";
import { isFunction } from "noka-utility";
import { LoaderOptions } from "./LoaderOptions";
import { setFileMeta } from "./FileMetadata";

type ModuleExports = Record<string, unknown>;

/**
 * 资源加载器抽象基类
 */
export abstract class AbstractLoader<
  T extends LoaderOptions = LoaderOptions,
  C = unknown,
> implements LoaderInstance
{
  /**
   * 开启观察能力
   */
  readonly watchable: boolean = true;

  /**
   * 通过 path 声明一个加载器实例
   * @param options 路径或匹配表达式
   */
  constructor(
    protected app: ApplicationLike,
    public options: T,
  ) {
    this.options = { targetDir: this.app.rootDir, ...options };
  }

  /**
   * 获取匹配的文件
   * @param paths 匹配表达式
   * @param options 匹配选项
   */
  protected glob(path: string | string[], options?: globby.GlobbyOptions) {
    const { targetDir = "app:/" } = this.options;
    const cwd = this.app.resolvePath(targetDir);
    const paths = Array.isArray(path) ? path : [path];
    const selector = paths.map((it) => this.app.resolvePath(it));
    return globby(selector, { ...options, cwd });
  }

  /**
   * 导入一个模块
   * @param moduleFile 模块路径
   */
  protected importModule<M = ModuleExports>(moduleFile: string): M | undefined {
    try {
      return require(this.app.resolvePath(moduleFile));
    } catch {
      return;
    }
  }

  /**
   * 已加载的资源或类型列表
   */
  protected items: C[] = [];

  /**
   * 加载通过 path 指定的内容
   */
  protected async loadModules(): Promise<C[]> {
    const moduleFiles = await this.glob("./**/*.:bin");
    const items: C[] = [];
    moduleFiles.forEach((moduleFile) => {
      const fileExports = this.importModule(moduleFile);
      if (!fileExports) return;
      Object.keys(fileExports).forEach((name) => {
        const mod: any = fileExports[name];
        items.push(mod);
        if (isFunction(mod)) setFileMeta(mod, { path: moduleFile });
      });
    });
    return items;
  }

  /**
   * 由应用调用的 load 方法
   */
  async load() {
    this.items = await this.loadModules();
  }
}
