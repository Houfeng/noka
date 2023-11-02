/** @format */

import { readFile } from "fs/promises";
import { resolve } from "path";

const { NOKA_ENV } = process.env;

type Assets = { styles: string[]; scripts: string[] };

let cachedAssets: Assets;

export async function getClientAssets(): Promise<Assets> {
  const manifestFile = "pi-manifest.json";
  if (NOKA_ENV === "development") {
    const res = await fetch(`http://127.0.0.1:8081/${manifestFile}`);
    return res.json();
  } else {
    if (cachedAssets) return cachedAssets;
    const file = resolve(__dirname, `../../assets/app/${manifestFile}`);
    const buffer = await readFile(file);
    cachedAssets = JSON.parse(buffer.toString("utf-8"));
    return cachedAssets;
  }
}
