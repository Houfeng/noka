import { FSWatcher, watch } from "chokidar";

export type DevToolOptions = {
  enabled: boolean;
  getWatchDir: () => string[];
};

export class DevTool {
  private options: DevToolOptions;
  private watcher?: FSWatcher;

  constructor(options: Partial<DevToolOptions>) {
    this.options = {
      enabled: false,
      getWatchDir: () => [],
      ...options,
    };
  }

  private reloadProcess = () => {
    if (!this.options.enabled) return;
    process.exit(0);
  };

  startWatch(): void {
    const { enabled, getWatchDir } = this.options;
    if (!enabled) return;
    if (this.watcher) this.stopWatch();
    const paths = getWatchDir();
    if (paths.length < 1) return;
    this.watcher = watch(paths, { ignoreInitial: true });
    this.watcher?.on("all", this.reloadProcess);
  }

  stopWatch() {
    if (!this.watcher) return;
    this.watcher.off("all", this.reloadProcess);
    this.watcher = undefined;
  }
}
