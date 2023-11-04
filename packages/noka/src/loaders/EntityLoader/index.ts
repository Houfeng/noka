import { DataSource, DataSourceOptions } from "typeorm";
import { LoaderOptions } from "../../Loader/LoaderOptions";
import { ContainerLike, Inject, InjectPropMetadata } from "../../Container";
import { AbstractLoader } from "../../Loader";
export * from "typeorm";

const entityKey = Symbol("Entity");

export type EntityLoaderOptions = LoaderOptions & DataSourceOptions;

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
export class EntityLoader extends AbstractLoader<EntityLoaderOptions> {
  async load() {
    await super.load();
    const { path = "bin:/entities/**/*:bin", ...others } = this.options;
    defaultOptions.location = this.app.resolvePath(defaultOptions.location);
    const dataSource = new DataSource({
      ...defaultOptions,
      ...others,
      entities: [this.app.resolvePath(path)],
    });
    this.app.container.register(entityKey, {
      type: "value",
      value: dataSource,
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
  container: ContainerLike,
  meta: InjectPropMetadata,
) {
  const source = container.get<DataSource>(entityKey);
  return source?.getRepository(meta.options?.extra as Function);
}

/**
 * 向目标注入数据实体仓库
 * @param entity 实体类型
 */
export function EntityRepo(entity: { new: () => any } | Function) {
  return Inject(undefined, { handle: entityRepoInjectHandler, extra: entity });
}

/**
 * 实体管理器注入处理函数
 * @param options 注入选项
 */
export function entityManagerInjectHandler(container: ContainerLike) {
  return container.get<DataSource>(entityKey)?.manager;
}

/**
 * 向目标注入实体管理器
 * @param entity 实体类型
 */
export function EntityManager() {
  return Inject(undefined, { handle: entityManagerInjectHandler });
}
