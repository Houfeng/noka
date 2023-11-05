import { AbstractLoader } from "../../Loader";
import { ApplicationLike } from "../../Application";

export type SetupOptions = {};
export type SetupFunction = (app?: ApplicationLike) => any;

export class SetupLoader extends AbstractLoader<SetupOptions, SetupFunction> {
  async load() {
    await super.load();
    await Promise.all(
      this.items.map(async (setup) => {
        // 应用启动时将自动执行
        const value = await setup(this.app);
        // 执行结果,可被 controller/service 等模块注入
        // 注入的名称为 fn.setupName > fn.displayName > fn.name
        this.app.container.register(setup.name, { type: "value", value });
        this.app.container.register(setup, { type: "value", value });
      }),
    );
    this.app.logger?.info("Setup ready");
  }
}
