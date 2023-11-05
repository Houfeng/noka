import { AbstractLoader } from "../../Loader";
import { Logger, Level } from "hilog";
import { mix } from "noka-utility";
import { EOL } from "os";

export interface LoggerInterface {
  /**
   * 输出 debug 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  debug(dataOrFormatter: any, ...args: any[]): any;

  /**
   * 输出 info 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  info(dataOrFormatter: any, ...args: any[]): any;

  /**
   * 输出 warn 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  warn(dataOrFormatter: any, ...args: any[]): any;

  /**
   * 输出 error 日志
   * @param dataOrFormatter 输出内容或格式化字符串
   * @param args 插入参数
   */
  error(dataOrFormatter: any, ...args: any[]): any;
}

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
    const options = mix({ ...defaultOptions }, this.options);
    options.path = this.app.resolvePath(options.path);
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
    await Logger.init({ ...options, root: options?.path });
    const getLogger = (category?: string) => Logger.get(category);
    this.app.container.register(this.app.loggerRegisterKey, {
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
