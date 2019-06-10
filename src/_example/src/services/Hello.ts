import { inject, provider } from "../../..";
import { config } from "../../../ConfigLoader";

@provider("test1")
export class Test1Service {
  name = "I am Test1";

  @inject("test2")
  test2: any;

  @inject()
  conn: any;
}

@provider("test2")
export class Test2Service {
  name = "I am Test2";

  @inject("db")
  db: any;

  @config("aaa")
  conf: any;

  find(opts: any) {
    this.db.find(opts);
  }
}
