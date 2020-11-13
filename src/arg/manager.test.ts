import { expect } from "https://deno.land/x/expect/mod.ts";

import { assertEquals } from "../../test/deps.ts";
import { build } from "./arg.ts";
import { ArgManager } from "./manager.ts";

Deno.test("lastArgType", async () => {
  const manager = ArgManager.init();

  assertEquals(manager.lastArgType(), undefined);
  const arg = build({ name: "foo-1" })
  manager.append(arg);
  assertEquals(manager.lastArgType(), 'xyz');
});
