import { FSWatcher, watch } from "chokidar";

export type DevToolOptions = {
  enabled: boolean;
  entry: string;
  watchDir: string[];
  resolvePath: (path: string) => string;
  stop: () => void;
};

export class DevTool {
  private watcher?: FSWatcher;
  private watchedDir: string[] = [];

  constructor(public options: DevToolOptions) {
    const { watchDir } = this.options;
    this.watchedDir = [...watchDir];
  }

  private reloadApp = () => {
    const { enabled } = this.options;
    if (!enabled) return;
    if (typeof require === "undefined" || !require.cache) {
      return process.exit(0);
    }
    this.options.stop();
    for (const path in require.cache) {
      if (this.inWatchedDir(path)) delete require.cache[path];
    }
    /* eslint-disable-next-line */
    console.clear();
    require(this.options.entry);
  };

  /**
   * @internal
   */
  inWatchedDir(path: string) {
    return this.watchedDir.some((it) => path.startsWith(it));
  }

  /**
   * 观察一个目录变化，并重载 app
   * @param targetDir 目标目录
   * @returns
   */
  watchDir(targetDir: string) {
    if (this.watcher) {
      const msg = "Unable to watch new directory after application startup";
      throw new Error(msg);
    }
    targetDir = this.options.resolvePath(targetDir);
    if (this.inWatchedDir(targetDir)) return;
    this.watchedDir.push(targetDir);
  }

  /**
   * @internal
   */
  startWatch(): void {
    const { enabled } = this.options;
    if (!enabled) return;
    if (this.watcher) this.stopWatch();
    if (this.watchedDir.length < 1) return;
    this.watcher = watch(this.watchedDir, {
      ignoreInitial: true,
      depth: Number.MAX_SAFE_INTEGER,
    });
    this.watcher?.on("all", this.reloadApp);
  }

  /**
   * @internal
   */
  stopWatch() {
    if (!this.watcher) return;
    this.watcher.off("all", this.reloadApp);
    this.watcher = undefined;
  }
}
