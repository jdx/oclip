// deno-lint-ignore-file no-explicit-any

import { ObjectOrPromiseOrFunction } from "./helpers.ts";

export type ParseFn<T> = (input: string) => T;
type ParseFnType<F> = F extends ParseFn<infer T> ? T : string;

export interface ArgOptionsBase {
  name: string;
  description?: string;
  hidden?: boolean;
  optional?: boolean;
  rest?: boolean;
  choices?: ObjectOrPromiseOrFunction<string>;
}

export type ArgOptions<D> =
  | (ArgOptionsBase & {
    default?: ObjectOrPromiseOrFunction<string>;
  })
  | (ArgOptionsBase & {
    parse: ParseFn<D>;
    default?: ObjectOrPromiseOrFunction<D>;
  });

export interface ArgConfig<D> extends ArgOptionsBase {
  //id: number;
  parse: ParseFn<D>;
  default?: ObjectOrPromiseOrFunction<D>;
  hidden: boolean;
  optional: boolean;
  rest: boolean;
}

export function buildConfig<D>(
  options: ArgOptions<D> & { parse: ParseFn<D> },
): ArgConfig<D>;
export function buildConfig(options: ArgOptions<string>): ArgConfig<string>;
export function buildConfig(options: ArgOptions<any>): ArgConfig<any> {
  return {
    parse: "parse" in options ? options.parse : ((input: string) => input),
    hidden: !!options.hidden,
    optional: !!options.optional,
    rest: !!options.rest,
    ...options,
  };
}
