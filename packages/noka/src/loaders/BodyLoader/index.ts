import { AbstractLoader } from "../../Loader";
import { Ctx } from "../ControllerLoader";
import koaBody from "koa-body";

export class BodyLoader extends AbstractLoader {
  public async load() {
    const options = { multipart: true, ...this.options };
    this.app.server.use(koaBody(options));
    this.app.logger?.info("Body ready");
  }
}

/**
 * 获取请求主体
 * @param name 请求表单项或字段名称，省略获取所有
 */
export const Body = (name?: string) =>
  name ? Ctx(`request.body.${name}`) : Ctx("request.body");

/**
 * 获取请求中的表单项数据
 * @param name 表单项名称，省略获取所有
 */
export const Form = Body;

/**
 * 获取上传的文件
 * @param name 文件参数名，省略获取所有
 */
export const File = (name?: string) =>
  name ? Ctx(`request.files.${name}`) : Ctx("request.files");
