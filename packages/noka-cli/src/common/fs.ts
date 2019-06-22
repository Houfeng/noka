import * as fs from "fs";

export function readDir(dir: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dir, (err, files) => (err ? reject(err) : resolve(files)));
  });
}

export function rename(oldPath: string, newPath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.rename(oldPath, newPath, err => (err ? reject(err) : resolve(newPath)));
  });
}
