import { observable } from "mota";
import { getLibraryEntityContent } from "../../services/LibraryService";

@observable
export class LibraryViewModel {
  path = "/";
  current: any = null;
  async load(path = "/") {
    this.path = path;
    this.current = await getLibraryEntityContent(this.path);
  }
}
