import { JSONValue } from "src/common/typed";

export type LoaderOptions = Record<string, JSONValue> & {
  path?: string;
};
