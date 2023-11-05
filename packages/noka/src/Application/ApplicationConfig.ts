export type ApplicationConfig = {
  name?: string;
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
  "name",
  "loaders",
];

export const ApplicationConfigRegisterKey = Symbol("Config");
export const ApplicationLoggerRegisterKey = Symbol("Logger");
