import { DataSource, DataSourceOptions } from "typeorm";
import { LoaderOptions } from "../../Loader/LoaderOptions";
import { ContainerLike, Inject, InjectMeta } from "../../Container";
import { AbstractLoader } from "../../Loader";

export * as ORM from "typeorm";
export * as Entities from "typeorm";

const entityBeanKey = Symbol("Entity");

export type EntityLoaderOptions = LoaderOptions<Partial<DataSourceOptions>>;

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
    const { targetDir: path = "bin:/entities/**/*:bin", ...others } =
      this.options;
    defaultOptions.location = this.app.resolvePath(defaultOptions.location);
    const dataSource = new DataSource({
      ...defaultOptions,
      ...others,
      entities: [this.app.resolvePath(path)],
    } as DataSourceOptions);
    this.app.container.register(entityBeanKey, {
      type: "value",
      value: dataSource,
    });
    await dataSource.initialize();
    this.app.logger?.info("Entity ready");
  }
}

/**
 * 向目标注入数据实体仓库
 * @param entity 实体类型
 */
export function InjectEntityRepository(entity: { new: () => any } | Function) {
  return Inject(undefined, {
    handle: (container: ContainerLike, meta: InjectMeta) => {
      const source = container.get<DataSource>(entityBeanKey);
      return source?.getRepository(meta.options?.extra as Function);
    },
    extra: entity,
  });
}

/**
 * 向目标注入实体管理器
 * @param entity 实体类型
 */
export function InjectEntityManager() {
  return Inject(undefined, {
    handle: (container: ContainerLike) => {
      return container.get<DataSource>(entityBeanKey)?.manager;
    },
  });
}
