/** @format */

export type ApplicationConfig = {
  name?: string;
  port?: number;
  loaders?: Record<string, string>;
  [key: string]: any;
};
