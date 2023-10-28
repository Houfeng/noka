import { AbstractLoader } from "../AbstractLoader";
import { Logger, Level } from "hilog";
import { mix } from "../common/utils";
import { LOGGER_ENTITY_KEY } from "./constants";
import { EOL } from "os";

const defaultOptions: any = {
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
      format: "[{time}] - {method} {url} {status} {rt}ms {hostname} #{pid}",
      location: "./access-{yyyy-MM-dd}.log",
    },
  },
};

/**
 * 日志加载器
 */
export class LoggerLoader extends AbstractLoader {
  /**
   * 是否仅打印日志到 console
   */
  protected get onlyConsole() {
    return (
      !this.app.env ||
      ["dev", "development", "test", "local"].includes(this.app.env)
    );
  }

  /**
   * 获取日志选项
   */
  protected getOptions() {
    const options = mix({ root: "~/logs", ...defaultOptions }, this.options);
    options.root = this.resolvePath(options.root);
    if (options.writers && this.onlyConsole) {
      Object.keys(options.writers).forEach((key) => {
        const writerConf = options.writers[key];
        if (!writerConf) return;
        writerConf.type = "console";
      });
    }
    return options;
  }

  /**
   * 初始化日志模块
   */
  public async load() {
    const options = this.getOptions();
    await Logger.init(options);
    const getLogger = (category?: string) => Logger.get(category);
    this.container.registerValue(LOGGER_ENTITY_KEY, getLogger);
    this.server.use(async (ctx, next) => {
      ctx.logger = await getLogger("ctx");
      const startTime = Date.now();
      await next();
      const { method, url, status, headers } = ctx;
      const ua = `"${headers["user-agent"]}"`;
      const rt = Date.now() - startTime;
      const fields = { method, url, status, rt, ua };
      getLogger("access").write(Level.info, fields);
    });
    this.server.on("error", (err, ctx) => {
      const { method, url, status, headers } = ctx;
      const ua = `"${headers["user-agent"]}"`;
      ctx.logger.error(method, url, ua, status, EOL, err);
      ctx.status = 500;
    });
  }
}
