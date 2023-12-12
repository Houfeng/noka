import "reflect-metadata";
import {
  AbstractLoader,
  ContainerLike,
  Inject,
  InjectMeta,
  LoaderOptions,
} from "noka";
import { DataSource, DataSourceOptions } from "typeorm";
import { isString } from "noka-util";

export * from "typeorm";

const entityBeanKey = Symbol("Entity");

export type EntityLoaderOptions = LoaderOptions<Partial<DataSourceOptions>>;

const defaultOptions = {
  type: "sqlite",
  database: "home:/data.db",
  synchronize: true,
  dropSchema: false,
  logging: false,
} satisfies EntityLoaderOptions;

/**
 * 模型加载器
 */
export class EntityLoader extends AbstractLoader<EntityLoaderOptions> {
  async load() {
    const opts = { ...defaultOptions, ...this.options };
    const { targetDir: root = "bin:/entities", type, database: db } = opts;
    const { synchronize, dropSchema } = opts;
    const resolve = this.app.resolvePath.bind(this.app);
    const dataSource = new DataSource({
      ...opts,
      database: type === "sqlite" && isString(db) ? resolve(db) : db,
      entities: [resolve(`${root}/**/!(*.{subscriber,migration}):bin`)],
      subscribers: [resolve(`${root}/**/*.subscriber:bin`)],
      migrations: [resolve(`${root}/**/*.migration:bin`)],
      synchronize: this.app.isSourceMode ? synchronize : false,
      dropSchema: this.app.isSourceMode ? dropSchema : false,
      // only for sql.js
      location: type === "sqljs" && opts.location && resolve(opts.location),
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
 * 注入数据实体仓库
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
 * 注入实体管理器
 */
export function InjectEntityManager() {
  return Inject(undefined, {
    handle: (container: ContainerLike) => {
      return container.get<DataSource>(entityBeanKey)?.manager;
    },
  });
}

/**
 * 注入数据源对象
 */
export function InjectDataSource() {
  return Inject(undefined, {
    handle: (container: ContainerLike) => {
      return container.get<DataSource>(entityBeanKey);
    },
  });
}

export default EntityLoader;
