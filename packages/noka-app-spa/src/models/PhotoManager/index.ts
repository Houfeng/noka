import { FSLibrary } from "../FSLibrary";
import { observable } from "mota";
import { clientManger } from "../ClientManger";

export type PhotoMangerOptions = {
  library: FSLibrary;
};

export type PhotoIndexingInfo = {
  status: "idle" | "finding" | "indexing" | "finished";
  total: number;
  index: number;
};

@observable
export class PhotoManger {
  constructor(public options: PhotoMangerOptions) {}

  createInitialIndexingInfo(): PhotoIndexingInfo {
    return { status: "idle", total: 0, index: 0 };
  }

  indexingInfo: PhotoIndexingInfo = this.createInitialIndexingInfo();

  updateIndexInfo(info: Partial<PhotoIndexingInfo>) {
    Object.assign(this.indexingInfo, info);
    clientManger.broadcast("library.indexing", this.indexingInfo);
  }

  async startIndexing() {
    if (this.indexingInfo?.status !== "idle") return;
    this.indexingInfo = this.createInitialIndexingInfo();
    const { library } = this.options;
    this.updateIndexInfo({ status: "finding" });
    const images = await library.filterByMime("image/*");
    const total = images.length;
    this.updateIndexInfo({ status: "indexing", total });
    for (let index = 0; index < total; index++) {
      this.updateIndexInfo({ index });
    }
    this.updateIndexInfo({ status: "finished" });
    setTimeout(() => this.updateIndexInfo({ status: "idle" }), 3000);
  }
}
