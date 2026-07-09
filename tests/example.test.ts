import test from "node:test";
import assert from "node:assert/strict";

import { validateProject } from "../src/validate.js";

test("generated example project is a valid AIDOS project", async () => {
  const result = await validateProject("examples/generated-project");

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});
