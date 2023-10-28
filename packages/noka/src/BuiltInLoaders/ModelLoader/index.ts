import { DataSource, DataSourceOptions } from "typeorm";
import { LoaderOptions } from '../../Loader/LoaderOptions';
import { ContainerType, Inject, InjectPropMetadata } from "../../Container";
import { existsSync } from "fs";
import { AbstractLoader } from "../../Loader";
export * from 'typeorm';

const DATA_SOURCE_ENTITY_KEY = Symbol('Model');

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
export class ModelLoader extends AbstractLoader<ModelLoaderOptions> {
  async load() {
    await super.load();
    const { path, ...others } = this.options;
    const modelRoot = this.resolvePath(path);
    if (!existsSync(modelRoot)) return;
    const source = new DataSource({
      ...defaultDataSourceOptions,
      ...others,
      entities: [modelRoot],
    });
    this.app.container.register(DATA_SOURCE_ENTITY_KEY, {
      type: "value",
      value: source
    });
    await source.initialize();
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
