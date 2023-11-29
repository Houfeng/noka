import "reflect-metadata";
import {
  AbstractLoader,
  ContainerLike,
  Inject,
  InjectMeta,
  LoaderOptions,
} from "noka";
import { DataSource, DataSourceOptions } from "typeorm";
import { isString } from "noka-utility";

export * from "typeorm";

const entityBeanKey = Symbol("Entity");

export type EntityLoaderOptions = LoaderOptions<Partial<DataSourceOptions>>;

const defaultOptions = {
  type: "sqlite",
  database: "home:/data.db",
  logging: false,
} satisfies EntityLoaderOptions;

/**
 * 模型加载器
 */
export class EntityLoader extends AbstractLoader<EntityLoaderOptions> {
  async load() {
    const options = { ...defaultOptions, ...this.options };
    const { targetDir: root = "bin:/entities", type, database: db } = options;
    const { synchronize, dropSchema } = options;
    const resolve = this.app.resolvePath.bind(this.app);
    const dataSource = new DataSource({
      ...options,
      database: type === "sqlite" && isString(db) ? resolve(db) : db,
      entities: [resolve(`${root}/**/!(*.{subscriber,migration}):bin`)],
      subscribers: [resolve(`${root}/**/*.subscriber:bin`)],
      migrations: [resolve(`${root}/**/*.migration:bin`)],
      synchronize: this.app.isSourceMode ? synchronize : false,
      dropSchema: this.app.isSourceMode ? dropSchema : false,
      // only for sql.js
      location: type === "sqljs" && options.location,
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
