/** @format */

import { JSONValue } from "noka-utility";

export type LoaderOptions = Record<string, JSONValue> & {
  path?: string;
};
