import { Inject, InjectGetterOptions } from "../../Container";
import { MODEL_CONN_ENTITY_KEY } from "./constants";
import { Connection } from "typeorm";

/**
 * 用于注入连接对象的 Getter 函数
 * @param options 注入选项
 */
function connInjectGetter(options: InjectGetterOptions) {
  const { container, info } = options;
  const connList: Connection[] = container.get(MODEL_CONN_ENTITY_KEY);
  return connList.find((item) => info.name === item.name) || connList[0];
}

/**
 * 向 service 或 controller 注入数据库联接对象
 * @param name 配置项的 JSON Path
 */
export function Conn(name?: string) {
  return Inject(name, { getter: connInjectGetter });
}

/**
 * 用于注入连接对象的 Getter 函数
 * @param options 注入选项
 */
function repoInjectGetter(options: InjectGetterOptions) {
  const { container, info } = options;
  const connList: Connection[] = container.get(MODEL_CONN_ENTITY_KEY);
  const conn = connList.find((item) => info.name === item.name) || connList[0];
  return conn ? conn.getRepository(info.options.entity) : null;
}

/**
 * 向 service 或 controller 注入 Entity 的 Repo
 * @param entity 实体类
 * @param name 连接名称，省略将在默认连接中查找 repo
 */
export function Repo(entity: string | Function, name?: string) {
  return Inject(name, { getter: repoInjectGetter, entity });
}
