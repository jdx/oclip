import { assertEquals } from "/deps.ts";
import { build } from "./arg.ts";

Deno.test("required", async () => {
  const arg = build({ name: "foo-1" });
  assertEquals(arg.type, "required");
});

Deno.test("optional", async () => {
  const arg = build({ name: "foo-1", optional: true });
  assertEquals(arg.type, "optional");
});

Deno.test("rest", async () => {
  const arg = build({ name: "foo-1", rest: true });
  assertEquals(arg.type, "rest");
});
