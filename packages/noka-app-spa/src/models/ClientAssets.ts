import { readFile } from "fs/promises";
import { resolve } from "path";

type Assets = { styles: string[]; scripts: string[] };
const { NOKA_ENV } = process.env;
let cachedAssets: Assets;

export async function getClientInitialAssets(host: string): Promise<Assets> {
  const manifestFile = "in-manifest.json";
  if (NOKA_ENV === "development") {
    const res = await fetch(`http://127.0.0.1:8081/${manifestFile}`);
    const assets = (await res.json()) as Assets;
    assets.styles = assets.styles.map((it) => it.replace("{host}", host));
    assets.scripts = assets.scripts.map((it) => it.replace("{host}", host));
    return assets;
  } else {
    if (cachedAssets) return cachedAssets;
    const file = resolve(__dirname, `../../public/app/${manifestFile}`);
    const buffer = await readFile(file);
    cachedAssets = JSON.parse(buffer.toString("utf-8"));
    return cachedAssets;
  }
}
