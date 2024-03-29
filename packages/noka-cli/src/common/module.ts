import fetch from "node-fetch";
import { mkdirp } from "noka-util";
import { createWriteStream, existsSync, renameSync, unlinkSync } from "fs";
import { homedir } from "os";
import { resolve } from "path";

const decompress = require("decompress");
const decompressTargz = require("decompress-targz");

const timeout = 30000;
const registry = "https://registry.npmjs.org";

export async function getInfo(name: string) {
  const url = `${registry}/${name}`;
  const res = await fetch(url, { timeout });
  const info = await res.json();
  if (!info || !info.versions || info.error) {
    throw new Error(`Cannot find module '${name}'`);
  }
  return info;
}

export async function getVersionInfo(name: string, version: string) {
  const modInfo = (await getInfo(name)) || {};
  const distTags = modInfo["dist-tags"] || {};
  version = version || "latest";
  version = distTags[version] || version;
  const lastVersion = Object.keys(modInfo.versions).pop() || "";
  return modInfo.versions[version] || modInfo.versions[lastVersion];
}

export function saveFile(filename: string, readStream: NodeJS.ReadableStream) {
  return new Promise((resolve) => {
    const writeStream = createWriteStream(filename);
    writeStream.on("finish", () => {
      setTimeout(resolve, 500);
    });
    readStream.pipe(writeStream);
  });
}

export function createStream(url: string) {
  return fetch(url).then((res) => {
    return res.body;
  });
}

export async function download(name: string, version?: string) {
  const info = await getVersionInfo(name, version || "");
  const pkgDir = resolve(homedir(), "./.noka-cli/modules");
  await mkdirp(pkgDir);
  const pkgFile = resolve(pkgDir, `${name}@${info.version}.tgz`);
  if (existsSync(pkgFile)) return pkgFile;
  const tmpFile = pkgFile + ".tmp";
  if (existsSync(tmpFile)) unlinkSync(tmpFile);
  const url = info && info.dist && info.dist.tarball;
  if (!url) throw new Error(`Cannot download ${name}`);
  const readStream = await createStream(url);
  await saveFile(tmpFile, readStream);
  renameSync(tmpFile, pkgFile);
  return pkgFile;
}

export async function extract(filename: string, dist: string, upIndex: number) {
  upIndex = upIndex || 0;
  return decompress(filename, dist, {
    plugins: [decompressTargz()],
    map: (file: any) => {
      file.path = file.path.split("/").slice(upIndex).join("/");
      return file;
    },
  });
}

export async function initTemplate(name: string, dist: string) {
  const filename = await download(name);
  await extract(filename, dist, 1);
}
