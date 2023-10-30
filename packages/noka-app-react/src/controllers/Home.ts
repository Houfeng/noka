/** @format */

import { readFile } from "fs/promises";
import { Controller, Get, View } from "noka";
import { resolve } from "path";

const { NOKA_ENV } = process.env;

async function getAssets() {
  const manifest = "pi-manifest.json";
  if (NOKA_ENV === "development") {
    const res = await fetch(`http://127.0.0.1:8081/${manifest}`);
    return res.json();
  } else {
    const file = resolve(__dirname, `../../assets/app/${manifest}`);
    const buffer = await readFile(file);
    return JSON.parse(buffer.toString("utf-8"));
  }
}

@Controller("/")
export class HomeController {
  @Get("/*")
  @View("index")
  async index() {
    const assets = await getAssets();
    return { NOKA_ENV, assets };
  }
}
