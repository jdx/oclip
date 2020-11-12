// deno-lint-ignore-file no-explicit-any

import {
  InvalidChoiceError,
  MultipleArgNotLastError,
  RequiredArgAfterOptionalValidationError,
  RequiredArgsError,
  UnexpectedArgsError,
} from "./error.ts";

export type ArgType = "required" | "optional" | "multiple";

export interface ArgBase<T> {
  name: string;
  description?: string;
  parse: (input: string) => T;
  toString(): string;
  order: number;
  default?: T | (() => Promise<T> | T);
  choices?: (string[]) | (() => Promise<string[]> | string[]);
}

export interface ArgOptions<T> {
  description?: string;
  default?: T | (() => Promise<T> | T);
  parse?: (input: string) => Promise<T> | T;
  choices?: (string[]) | (() => Promise<string[]> | string[]);
}

export type RequiredArg<T> = ArgBase<T> & { type: "required" };
export type OptionalArg<T> = ArgBase<T> & { type: "optional" };
export type MultipleArg<T> = ArgBase<T> & { type: "multiple" };
export type Arg<T> = RequiredArg<T> | OptionalArg<T> | MultipleArg<T>;
export type List = readonly Arg<unknown>[];

function build<T>(
  name: string,
  type: ArgType,
  options: ArgOptions<T> & { parse: (input: string) => T },
): Arg<T>;
function build(
  name: string,
  type: ArgType,
  options?: ArgOptions<any>,
): Arg<string>;
function build(
  name: string,
  type: ArgType,
  options: ArgOptions<any> = {},
): Arg<any> {
  return {
    name,
    type,
    description: options.description,
    order: -1,
    parse: options.parse || ((input: string) => input),
    default: options.default,
    choices: options.choices,
    toString() {
      let s = "";
      //if (this.hidden) return s;
      if (this.name) {
        s += `${this.name.toUpperCase()}`;
      }
      // if (!usage) return s;
      return s;
    },
  };
}

export const required = <T=string>(
  name: string,
  options: ArgOptions<T> = {},
): RequiredArg<T> => build(name, "required", options) as any;
export const optional = <T=string>(
  name: string,
  options: ArgOptions<T> = {},
): OptionalArg<T> => build(name, "optional", options) as any;
export const multiple = <T=string>(
  name: string,
  options: ArgOptions<T> = {},
): MultipleArg<T> => build(name, "multiple", options) as any;

export type ArgToResult<A> = A extends OptionalArg<infer T> ? T | undefined
  : A extends RequiredArg<infer T> ? T
  : A extends MultipleArg<infer T> ? T[]
  : never;
export type ListToResults<A> = {
  [K in keyof A]: A[K] extends Arg<unknown> ? ArgToResult<A[K]> : never;
};

export function validate(argDefs: List) {
  let state: ArgType = "required";
  let prev: Arg<any> | undefined;
  for (const def of argDefs) {
    switch (state) {
      case "required":
        if (def.type === "multiple") state = "multiple";
        else if (def.type !== "required") state = "optional";
        break;
      case "optional":
        if (
          def.type === "required" && prev
        ) {
          throw new RequiredArgAfterOptionalValidationError(prev, def);
        }
        if (def.type === "multiple" === true) state = "multiple";
        break;
      case "multiple":
        throw new MultipleArgNotLastError(prev as any, def);
    }
    prev = def;
  }
}

export async function parse(argv: string[], defs: List): Promise<any[]> {
  setOrder(defs);

  // gather inputs
  const results: any[] = [];
  for (let i = 0; i < argv.length; i++) {
    const input = argv[i];
    const def = defs[i];
    if (!def) break;
    const choices = await getChoices(def);
    if (def.type === "multiple") {
      const multipleResults = [];
      for (; i < argv.length; i++) {
        const input = argv[i];
        await verifyChoices(choices, input);
        multipleResults.push(await def.parse(input));
      }
      results.push(multipleResults);
      break;
    }
    await verifyChoices(choices, input);
    results.push(await def.parse(input));
  }

  // attempt to fill in missing args with defaults
  const missingArgs = defs.slice(results.length);
  for (const def of missingArgs) {
    if (!def.default) continue;
    let result = def.default;
    if (typeof result === "function") {
      result = await result();
    }
    if (result !== undefined) {
      results[def.order] = result;
    }
  }

  const missingRequiredArgs = defs.filter((a) =>
    a.type === "required" && results[a.order] === undefined
  );
  if (missingRequiredArgs.length) {
    throw new RequiredArgsError(missingRequiredArgs);
  }

  const maxArgs = numOptionalArgs(defs);
  if (maxArgs !== -1 && argv.length > maxArgs) {
    throw new UnexpectedArgsError(argv.slice(maxArgs));
  }

  return results;
}

function setOrder(defs: List) {
  for (let i = 0; i < defs.length; i++) {
    defs[i].order = i;
  }
}

const numOptionalArgs = (args: List) =>
  args.reduce((total, arg) => arg.type === "multiple" ? -1 : total + 1, 0);

const getChoices = async (def: Arg<any>): Promise<string[] | undefined> => {
  switch (typeof def.choices) {
    case "function":
      return def.choices();
    case "object":
      return def.choices;
  }
};

const verifyChoices = async (choices: string[] | undefined, input: string) => {
  if (!choices) return;
  if (choices.includes(input)) return;
  throw new InvalidChoiceError(choices, input);
};
