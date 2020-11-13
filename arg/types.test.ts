// deno-lint-ignore-file no-explicit-any

import { assertObjectMatch } from "../test/deps.ts";
import { buildConfig } from "./config.ts";
import { RequiredArg } from "./types.ts";

Deno.test("RequiredArg", () => {
  const cfg = buildConfig({ name: "foo-1" });
  const arg = new RequiredArg(cfg);

  assertObjectMatch(arg as any, { type: "required", name: "foo-1" });
});
