export type ApplicationConfig = {
  port?: number;
  hostname?: string;
  secure?: { key: string; cert: string };
  loaders?: Record<string, string>;
  [key: string]: any;
};

export const ApplicationConfigKeys = [
  "port",
  "hostname",
  "secure",
  "loaders",
  // name 目前没有用暂保留
  "name",
];

export const ApplicationConfigRegisterKey = Symbol("Config");
export const ApplicationLoggerRegisterKey = Symbol("Logger");
