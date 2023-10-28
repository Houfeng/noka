/** @format */

import { JSONValue } from "../common/typed";

export type LoaderOptions = Record<string, JSONValue> & {
  path?: string;
};
