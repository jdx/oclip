import { assertEquals } from "../test/deps.ts";
import { build } from "./arg.ts";
import { ArgManager } from "./manager.ts";

Deno.test("lastArgType", async () => {
  const arg = build({ name: "foo-1" });
  const manager = ArgManager.init();
  manager
    .append(arg)
    .append(build({ name: "x", optional: true }))
    .append(build({ name: "foo-1", parse: (input: string) => 1 }))
    .lastArgType();

  assertEquals(manager.lastArgType(), undefined);
  assertEquals(manager.append(arg).lastArgType(), "required");
});
