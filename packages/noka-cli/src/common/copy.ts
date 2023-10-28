/** @format */

const copyFiles = require("copy");

export function copy(files: string[] | string, target: string) {
  return new Promise((resolve, reject) => {
    copyFiles(files, target, (err: Error, files: string[]) => {
      return err ? reject(err) : resolve(files);
    });
  });
}
