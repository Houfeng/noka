import { DataSource, DataSourceOptions } from "typeorm";
import { LoaderOptions } from '../../Loader/LoaderOptions';
import { ContainerType, Inject, InjectPropMetadata } from "../../Container";
import { AbstractLoader } from "../../Loader";
export * from 'typeorm';

const MODEL_ENTITY_KEY = Symbol('Model');

export type ModelLoaderOptions = LoaderOptions & DataSourceOptions

const defaultOptions = {
  type: "sqljs",
  location: "./data/store.db",
  autoSave: true,
  synchronize: true,
  logging: false,
};

/**
 * 模型加载器
 */
export class ModelLoader extends AbstractLoader<ModelLoaderOptions> {
  async load() {
    await super.load();
    const { path, ...others } = this.options;
    defaultOptions.location = this.resolvePath(defaultOptions.location);
    const dataSource = new DataSource({
      ...defaultOptions,
      ...others,
      entities: [this.resolvePath(path)],
    });
    this.app.container.register(MODEL_ENTITY_KEY, {
      type: "value",
      value: dataSource
    });
    await dataSource.initialize();
    this.app.logger?.info("Model ready");
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
  const source = container.get<DataSource>(MODEL_ENTITY_KEY);
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
  return container.get<DataSource>(MODEL_ENTITY_KEY).manager;
}

/**
 * 向目标注入实体管理器
 * @param entity 实体类型
 */
export function EntityManager() {
  return Inject(null, { handle: entityManagerInjectHandler });
}
