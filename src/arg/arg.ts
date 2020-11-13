// deno-lint-ignore-file no-explicit-any

import { ArgOptions, buildConfig, ParseFn } from "./config.ts";
import { Arg, OptionalArg, RequiredArg, RestArg } from "./types.ts";

export function build<D>(options: ArgOptions<D> & ParseFn<D>): Arg<D>
export function build(options: ArgOptions<string>): Arg<string>
export function build(options: ArgOptions<any>): Arg<any> {
  const cfg = buildConfig(options);

  if (cfg.rest) return new RestArg(cfg);
  if (cfg.optional) return new OptionalArg(cfg);
  return new RequiredArg(cfg);
}
