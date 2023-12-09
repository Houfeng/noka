import { FSWatcher, watch } from "chokidar";
import { iife } from "noka-utility";
import { ApplicationLogger } from "../Application/ApplicationLogger";

type Timer = NodeJS.Timeout;
type TimerHandler = (...args: any) => void;

function createTimerHooks() {
  const { setInterval: _setInterval, setTimeout: _setTimeout } = global;
  const timers = new Set<Timer>();
  const clearAllTimers = () =>
    timers.forEach((timer) => [
      clearInterval(timer),
      clearTimeout(timer),
      timers.delete(timer),
    ]);
  const setTimeout = (fn: TimerHandler, ms?: number) => {
    const timer: Timer = _setTimeout(() => [fn?.(), timers.delete(timer)], ms);
    timers.add(timer);
    return timer;
  };
  const setInterval = (fn: TimerHandler, ms?: number) => {
    const timer: Timer = _setInterval(() => fn?.(), ms);
    timers.add(timer);
    return timer;
  };
  return { setTimeout, setInterval, clearAllTimers };
}

export type DevToolOptions = {
  enabled: boolean;
  entry: string;
  watchDir: string[];
  resolvePath: (path: string) => string;
  stopApp: () => Promise<void>;
  logger: () => ApplicationLogger | undefined;
};

export class DevTool {
  private watcher?: FSWatcher;
  private watchedDir: string[] = [];

  constructor(public options: DevToolOptions) {
    const { watchDir } = this.options;
    this.watchedDir = [...watchDir];
  }

  private timerHooks = iife(() => {
    if (!this.options.enabled) return;
    const hooks = createTimerHooks();
    Object.assign(global, hooks);
    return hooks;
  });

  private reloadApp = async () => {
    const { enabled, entry, stopApp, logger } = this.options;
    if (!enabled) return;
    if (typeof require === "undefined" || !require.cache) {
      return process.exit(0);
    }
    this.timerHooks?.clearAllTimers();
    await stopApp();
    for (const path in require.cache) {
      if (this.inWatchedDir(path)) delete require.cache[path];
    }
    logger()?.info("╔═══════════════════╗");
    logger()?.info("║  NOKA APP RELOAD  ║");
    logger()?.info("╚═══════════════════╝");
    require(entry);
  };

  private inWatchedDir(path: string) {
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
