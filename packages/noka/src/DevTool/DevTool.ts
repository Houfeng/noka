import { FSWatcher, watch } from "chokidar";

export type DevToolOptions = {
  enabled: boolean;
  binDir: string;
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

  private reloadProcess = () => {
    const { enabled, binDir } = this.options;
    if (!enabled) return;
    if (typeof require === "undefined" || !require.cache) {
      return process.exit(0);
    }
    this.options.stop();
    for (const key in require.cache) {
      if (key.startsWith(binDir)) delete require.cache[key];
    }
    /* eslint-disable-next-line */
    console.clear();
    require(this.options.entry);
  };

  watchDir(targetDir: string) {
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
    this.watcher?.on("all", this.reloadProcess);
  }

  /**
   * @internal
   */
  stopWatch() {
    if (!this.watcher) return;
    this.watcher.off("all", this.reloadProcess);
    this.watcher = undefined;
  }
}
