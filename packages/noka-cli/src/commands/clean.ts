import * as del from "del";
import { DIST_PATH } from "../common/consts";

export async function clean() {
  await del(DIST_PATH);
}
