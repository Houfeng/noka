/** @format */

import { strictEqual } from "assert";

describe("Array", () => {
  describe("#indexOf()", () => {
    it("should return -1 when the value is not present", () => {
      strictEqual(-1, [1, 2, 3].indexOf(5));
    });
  });
});
