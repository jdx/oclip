import { expect } from "../deps.ts";
import { build } from "./arg.ts";

Deno.test("required", async () => {
  const arg = build({ name: "foo-1" });
  expect(arg.type).toBe("required");
});

Deno.test("optional", async () => {
  const arg = build({ name: "foo-1", optional: true });
  expect(arg.type).toBe("optional");
});

Deno.test("rest", async () => {
  const arg = build({ name: "foo-1", rest: true });
  expect(arg.type).toBe("rest");
});
