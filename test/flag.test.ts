// deno-lint-ignore-file no-explicit-any

import { assertEquals } from "./deps.ts";
import { arg, command } from "../mod.ts";

Deno.test("single flag", async () => {
  const cmd = command({
    args: [arg.required('f')] as const,
    flags: {verbose: {} as any} as const,
    run(args) {
      return args[0];
    },
  });
  const result = await cmd.exec(["123"]);
  assertEquals(result, "123");
});
