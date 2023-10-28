import { DataSource, DataSourceOptions } from "typeorm";
import { IoCLoader } from "../IoCLoader";
import { LoaderOptions } from '../../../types/Loader/LoaderOptions';

const DATA_SOURCE_ENTITY_KEY = Symbol('DataSource');

export type ModelLoaderOptions = LoaderOptions & DataSourceOptions

const defaultDataSourceOptions = {
  type: "sqljs",
  location: "./data/store.db",
  autoSave: true,
  synchronize: true,
  logging: false,
};

/**
 * 模型加载器
 */
export class ModelLoader extends IoCLoader<ModelLoaderOptions> {
  async load() {
    await super.load();
    const { path, ...others } = this.options;
    const source = new DataSource({
      ...defaultDataSourceOptions,
      ...others,
      entities: [this.resolvePath(path)],
    });
    this.container.register(DATA_SOURCE_ENTITY_KEY, {
      type: "value",
      value: source
    });
    await source.initialize();
    this.app.logger.info("Model ready");
  }
}
