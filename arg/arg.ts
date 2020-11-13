// deno-lint-ignore-file no-explicit-any

import { ArgOptions, buildConfig, ParseFn } from "./config.ts";
import {
  Arg,
  ArgTypeFromOpts,
  OptionalArg,
  RequiredArg,
  RestArg,
} from "./types.ts";

// TODO: return the right types here
export function build<D, AO extends ArgOptions<any>>(
  options: AO & ParseFn<D>,
): ArgTypeFromOpts<AO, D>;
export function build<AO extends ArgOptions<any>>(
  options: AO,
): ArgTypeFromOpts<AO, string>;
export function build(options: ArgOptions<any>): Arg<any> {
  const cfg = buildConfig(options);

  if (cfg.rest) return new RestArg(cfg);
  if (cfg.optional) return new OptionalArg(cfg);
  return new RequiredArg(cfg);
}
