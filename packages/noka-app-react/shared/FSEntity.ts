export type FSEntity<T extends string> = {
  type: T;
  name: string;
  path: string;
  size?: number;
  mime?: string;
  ctime?: number;
  mtime?: number;
}

export type FSFolder = FSEntity<"folder">;
export type FSFile = FSEntity<"file">;

export type FSImageFile = FSFile & {
  thumb: string;
}

export type FSAnyEntity = FSFolder | FSFile;