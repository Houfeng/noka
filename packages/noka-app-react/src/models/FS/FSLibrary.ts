import { FSEntity } from "./FSEntity";

export class FSLibrary extends FSEntity {
  constructor(root: string) {
    super(root, { type: 'folder', path: '/', name: '' });
  }
}
