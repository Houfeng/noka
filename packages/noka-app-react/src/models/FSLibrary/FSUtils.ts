import { extname } from "path";
import { mime } from "noka";

export function getMimeType(name: string) {
  const ext = extname(name).slice(1);
  return mime.getType(ext) || "";
}

export function isImageFile(name: string) {
  const type = getMimeType(name);
  return type?.startsWith("image/");
}
