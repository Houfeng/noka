import { resolve } from "path";
import { AppInfo } from "./AppInfo";
import { existsSync } from "fs";
import { exec } from "./exec";
import { copy } from "./copy";
import mkdirp from "mkdirp";
import del from "del";

export function Hooks(info: AppInfo) {
  const file = resolve(info.root, "./noka.config.js");
  const config = existsSync(file) ? require(file) : {};
  const utils = { exec, copy, mkdirp, del };
  const context = { info, utils };
  const beforeHooks = {
    clean: async (ctx = context) => config.beforeHooks?.clean?.(ctx),
    lint: async (ctx = context) => config.beforeHooks?.lint?.(ctx),
    test: async (ctx = context) => config.beforeHooks?.test?.(ctx),
    dev: async (ctx = context) => config.beforeHooks?.dev?.(ctx),
    build: async (ctx = context) => config.beforeHooks?.build?.(ctx),
    release: async (ctx = context) => config.beforeHooks?.release?.(ctx),
  };
  const afterHooks = {
    clean: async (ctx = context) => config.afterHooks?.clean?.(ctx),
    lint: async (ctx = context) => config.afterHooks?.lint?.(ctx),
    test: async (ctx = context) => config.afterHooks?.test?.(ctx),
    build: async (ctx = context) => config.afterHooks?.build?.(ctx),
    release: async (ctx = context) => config.afterHooks?.release?.(ctx),
  };
  return { beforeHooks, afterHooks };
}

export type NokaCLIHooks = ReturnType<typeof Hooks>;

export function defineConfig(config: NokaCLIHooks): NokaCLIHooks {
  return config;
}
