import { createConnections } from "typeorm";
import { IoCLoader } from "../IoCLoader";
import { isArray } from "util";
import { MODEL_CONN_ENTITY_KEY } from "./constants";
export * from "typeorm";

/**
 * 模型加载器
 */
export class ModelLoader<T = any> extends IoCLoader<T> {
  protected get defaultConnection() {
    return {
      type: "sqljs",
      location: "./data/store.db",
      autoSave: true,
      synchronize: true,
      logging: false
    };
  }

  protected wrapConnection(connection: any) {
    const conn = { ...this.defaultConnection, ...connection };
    conn.entities = conn.entities || [this.options.path];
    ["entities", "subscribers", "entitySchemas", "migrations"].forEach(key => {
      if (!conn[key]) return;
      conn[key] = this.resolvePaths(conn[key]);
    });
    if (conn.type === "sqljs") {
      conn.location = this.resolvePath(conn.location);
    }
    if (conn.type === "sqlite") {
      conn.datebase = this.resolvePath(conn.datebase);
    }
    return conn;
  }

  async load() {
    await super.load();
    const { connection = {} } = this.options;
    const items = isArray(connection)
      ? connection.map(item => this.wrapConnection(item))
      : [this.wrapConnection(connection)];
    const connections = await createConnections(items);
    this.app.container.registerValue(MODEL_CONN_ENTITY_KEY, connections);
    this.app.logger.info("Model ready");
  }
}
