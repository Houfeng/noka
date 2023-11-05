const fileMetaKey = Symbol("file");

export type FileMeta = {
  path: string;
};

export function setFileMeta(target: Function, meta: FileMeta) {
  Reflect.metadata(fileMetaKey, meta)(target);
}

export function getFileMeta(target: Function): FileMeta {
  return Reflect.getMetadata(fileMetaKey, target);
}
