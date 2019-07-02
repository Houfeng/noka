import * as React from "react";
import { render } from "ink";
import { Table } from "../components/Table";

export function showTable(data: any[]) {
  render(<Table data={data} />);
}
