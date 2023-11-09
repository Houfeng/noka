import { FSWatcher, watch } from "chokidar";

export type DevToolOptions = {
  enabled: boolean;
  watchDir: (() => string[]) | string[];
  resolvePath: (path: string) => string;
};

export class DevTool {
  private watcher?: FSWatcher;
  private watchedDir: string[] = [];

  constructor(public options: DevToolOptions) {
    const { watchDir } = this.options;
    this.watchedDir = Array.isArray(watchDir) ? watchDir : watchDir();
  }

  private reloadProcess = () => {
    if (!this.options.enabled) return;
    process.exit(0);
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
