import { AbstractLoader, LoaderOptions } from "../../Loader";
import { BeanConstructor } from "../../Container";
import { getSetupMeta } from "./SetupMeta";
import { ApplicationLike } from "../../Application";

export type SetupOptions = LoaderOptions;

export type SetupInstance = {
  handle: (app: ApplicationLike) => any;
};

export type SetupConstructor = BeanConstructor<SetupInstance>;

export class SetupLoader extends AbstractLoader<
  SetupOptions,
  SetupConstructor
> {
  async launch() {
    const { logger } = this.app;
    (await this.loadModules())
      .map((Setup) => ({ Setup, meta: getSetupMeta(Setup) }))
      .filter((it) => !!it.Setup && !!it.meta)
      .sort((a, b) => b.meta.priority - a.meta.priority)
      .forEach(async ({ Setup, meta }) => {
        // 应用启动时将自动执行
        const setupInstance = new Setup();
        this.app.container.inject(setupInstance);
        const value = await setupInstance.handle(this.app);
        // 执行结果,可被 controller/service 等模块注入
        this.app.container.register(meta.name, { type: "value", value });
        this.app.container.register(Setup, { type: "value", value });
      });
    logger?.info("Setup ready");
  }
}
