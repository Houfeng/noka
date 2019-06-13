import * as del from "del";

export async function clean() {
  await del("./lib");
}
