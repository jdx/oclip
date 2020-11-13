import { assertEquals } from "../../test/deps.ts";
import {buildConfig} from './config.ts';
import { RequiredArg } from "./types.ts";

Deno.test('RequiredArg', () => {
  const cfg = buildConfig({name: 'foo-1'});
  const arg = new RequiredArg(cfg);

  assertEquals(cfg.name, 'foo-1');
  assertEquals(cfg.choices, undefined);
  assertEquals(cfg.default, undefined);
  assertEquals(cfg.description, undefined);
  assertEquals(cfg.hidden, false);
  assertEquals(cfg.optional, false);
  assertEquals(cfg.parse('abc'), 'abc');
  assertEquals(cfg.rest, false);
})
