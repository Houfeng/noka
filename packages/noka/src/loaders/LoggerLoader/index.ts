import { AbstractLoader } from "../../Loader";
import { Logger, Level } from "hilog";
import { merge } from "noka-util";
import { EOL } from "os";

const defaultOptions = {
  writers: {
    error: {
      type: "file",
      categories: ["*"],
      level: [Level.warn, Level.error],
      location: "./error-{yyyy-MM-dd}.log",
    },
    app: {
      type: "file",
      categories: ["app"],
      level: [Level.debug, Level.info],
      location: "./app-{yyyy-MM-dd}.log",
    },
    ctx: {
      type: "file",
      categories: ["ctx"],
      level: [Level.debug, Level.info],
      location: "./ctx-{yyyy-MM-dd}.log",
    },
    access: {
      type: "file",
      categories: ["access"],
      level: [Level.info],
      format: "[{time}] {method} {url} {status} {rt}ms {hostname} #{pid}",
      location: "./access-{yyyy-MM-dd}.log",
    },
  } as Record<string, { type: string; format?: string }>,
};

/**
 * 日志加载器
 */
export class LoggerLoader extends AbstractLoader {
  /**
   * 获取日志选项
   */
  protected makeOptions() {
    const options = merge(defaultOptions, this.options);
    options.targetDir = this.app.resolvePath(options.targetDir || "");
    if (options.writers && this.app.isSourceMode) {
      Object.keys(options.writers).forEach((key) => {
        const writerConf = options.writers[key];
        if (!writerConf) return;
        writerConf.type = "console";
        if (key !== "access") writerConf.format = "[{time}] {data}";
        else writerConf.format = "[{time}] {method} {url} {status} {rt}ms";
      });
    }
    return options;
  }

  /**
   * 初始化日志模块
   */
  public async load() {
    const options = this.makeOptions();
    await Logger.init({ ...options, root: options?.targetDir });
    const getLogger = (category?: string) => Logger.get(category);
    this.app.container.register(this.app.symbols.Logger, {
      type: "value",
      value: getLogger,
    });
    this.app.server.use(async (ctx, next) => {
      ctx.logger = await getLogger("ctx");
      const startTime = Date.now();
      await next();
      const { method, url, status, headers } = ctx;
      const ua = `"${headers["user-agent"]}"`;
      const rt = Date.now() - startTime;
      const fields = { method, url, status, rt, ua };
      getLogger("access").write(Level.info, fields);
    });
    this.app.server.on("error", (err, ctx) => {
      const { method, url, status, headers } = ctx;
      const ua = `"${headers["user-agent"]}"`;
      ctx.logger.error(method, url, ua, status, EOL, err);
      ctx.status = 500;
    });
    this.app.logger?.info("Logger ready");
  }
}
