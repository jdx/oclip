import { assertEquals } from "/deps.ts";
import {buildConfig} from './config.ts';
import { RequiredArg } from "./types.ts";

Deno.test('RequiredArg', () => {
  const cfg = buildConfig({name: 'foo-1'});
  const arg = new RequiredArg(cfg);
  console.log(arg);
})
