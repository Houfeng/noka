/** @format */

export type ApplicationConfig = {
  name?: string;
  port?: number;
  hostname?: string;
  loaders?: Record<string, string>;
  [key: string]: any;
};
