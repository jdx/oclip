import { expect } from "../deps.ts";
import { build } from "./arg.ts";
import { ArgManager } from "./manager.ts";

Deno.test("lastArgType", async () => {
  const manager = ArgManager.init();

  expect(manager.lastArgType()).toBe(undefined);
  const arg = build({ name: "foo-1" });
  manager.append(arg);
  expect(manager.lastArgType()).toBe("xyz");
});
