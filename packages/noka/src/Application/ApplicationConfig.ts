export type ApplicationConfig = {
  name?: string;
  port?: number;
  hostname?: string;
  secure?: { key: string; cert: string };
  loaders?: Record<string, string>;
  [key: string]: any;
};
