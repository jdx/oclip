// deno-lint-ignore-file no-explicit-any

import type { Alphabet } from "./alphabet.ts";

export interface FlagBase {
  name: string;
  char?: Alphabet;
  description?: string;
  required: boolean;
  dependsOn?: string[];
  exclusive?: string[];
  hidden?: boolean;
  toString(): string;
  multiple: boolean;
}

export interface BoolFlag extends FlagBase {
  type: "boolean";
  allowNo: boolean;
}

export interface InputFlag<T> extends FlagBase {
  type: "input";
  helpValue?: string;
  parse: (input: string) => Promise<T>;
  choices?: () => Promise<string[]>;
  default?: () => Promise<T>;
}

export type Flag<T> = BoolFlag | InputFlag<T>;
export type Flags = { [name: string]: Flag<any> };
