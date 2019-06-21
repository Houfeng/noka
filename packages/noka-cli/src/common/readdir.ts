import { readdir } from "fs";

export function readDir(dir: string) {
  return new Promise<string[]>((resolve, reject) => {
    readdir(dir, (err, files) => (err ? reject(err) : resolve(files)));
  });
}
