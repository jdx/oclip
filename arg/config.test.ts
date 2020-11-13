import { assertEquals } from "../test/deps.ts";
import { ArgOptions, buildConfig } from "./config.ts";

Deno.test("config", () => {
  const cfg = buildConfig({ name: "foo-1" });
  assertEquals(cfg.name, "foo-1");
  assertEquals(cfg.choices, undefined);
  assertEquals(cfg.default, undefined);
  assertEquals(cfg.description, undefined);
  assertEquals(cfg.hidden, false);
  assertEquals(cfg.optional, false);
  assertEquals(cfg.parse("abc"), "abc");
  assertEquals(cfg.rest, false);
});
