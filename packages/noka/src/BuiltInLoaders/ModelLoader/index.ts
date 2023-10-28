import { DataSource, DataSourceOptions } from "typeorm";
import { IoCLoader } from "../IoCLoader";
import { LoaderOptions } from '../../Loader/LoaderOptions';
import { ContainerType, Inject, InjectPropMetadata } from "../../Container";
export * from 'typeorm';

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
    const { path = "./:src/models/**/*:ext", ...others } = this.options;
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
    this.app.logger.info('Model root:', path);
    this.app.logger.info("Model ready");
  }
}

/**
 * 实体仓库注入处理函数
 * @param options 注入选项
 */
export function entityRepoInjectHandler(
  container: ContainerType,
  meta: InjectPropMetadata,
) {
  const source = container.get<DataSource>(DATA_SOURCE_ENTITY_KEY);
  return source.getRepository(meta.options?.extra as Function);
}


/**
 * 向目标注入数据实体仓库
 * @param entity 实体类型
 */
export function EntityRepo(entity: { new: () => any } | Function) {
  return Inject(null, { handle: entityRepoInjectHandler, extra: entity });
}


/**
 * 实体管理器注入处理函数
 * @param options 注入选项
 */
export function entityManagerInjectHandler(
  container: ContainerType,
) {
  return container.get<DataSource>(DATA_SOURCE_ENTITY_KEY).manager;
}

/**
 * 向目标注入实体管理器
 * @param entity 实体类型
 */
export function EntityManager() {
  return Inject(null, { handle: entityManagerInjectHandler });
}
