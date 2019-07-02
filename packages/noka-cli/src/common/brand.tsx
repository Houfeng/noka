import * as React from "react";
import { render } from "ink";

const BigText = require("ink-big-text");
const pkg = require("../../package.json");

export function showBrand() {
  render(<BigText text={pkg.displayName} />);
}
