import "reflect-metadata";
import {
  AbstractLoader,
  ContainerLike,
  Inject,
  InjectMeta,
  LoaderOptions,
} from "noka";
import { DataSource, DataSourceOptions } from "typeorm";

export * from "typeorm";

const entityBeanKey = Symbol("Entity");

export type EntityLoaderOptions = LoaderOptions<Partial<DataSourceOptions>>;

const defaultOptions = {
  type: "sqljs",
  location: "home:/data.db",
  autoSave: true,
  synchronize: true,
  logging: false,
};

/**
 * 模型加载器
 */
export class EntityLoader extends AbstractLoader<EntityLoaderOptions> {
  async load() {
    const options = { ...defaultOptions, ...this.options };
    const { targetDir = "bin:/entities", location, ...others } = options;
    const dataSource = new DataSource({
      ...others,
      location: this.app.resolvePath(location),
      entities: [this.app.resolvePath(`${targetDir}/**/*:bin`)],
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

export default EntityLoader;
