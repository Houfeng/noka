import { AbstractLoader } from "../../Loader";
import { ApplicationInterface } from "../../Application";

export type SetupFunction = (app?: ApplicationInterface) => Promise<any> | any;

export class SetupLoader extends AbstractLoader<{}, SetupFunction> {
  async load() {
    await super.load();
    await Promise.all(
      this.items.map(async (func) => {
        const value = await func(this.app);
        this.app.container.register(func.name, { type: "value", value });
      }),
    );
    this.app.logger?.info("Setup ready");
  }
}
