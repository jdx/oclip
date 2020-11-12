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

export interface FlagOpts {
  /** a single character short flag (e.g.: -f) */
  char?: Alphabet;
  /** a short description of what this flag does for help */
  description?: string;
  /** set to true to require the flag to be set on a command */
  required?: boolean;
  /** this flag must also have another flag set or the CLI will error out */
  dependsOn?: string[];
  /** the flag may not be run if these other flags are set */
  exclusive?: string[];
  /**
   * allow the user to use the flag but don't display it in the help.
   * This is helpful when you want to release something to try out but don't
   * want to document it to keep users from discovering it
   */
  hidden?: boolean;
}

export interface BoolFlag extends FlagBase {
  type: "boolean";
  allowNo: boolean;
}

export interface BoolFlagOpts extends FlagOpts {
  /** allow the user to set `--no-thisflag` to set it to false */
  allowNo?: boolean;
}

export interface InputFlag<T> extends FlagBase {
  type: "input";
  helpValue?: string;
  parse: (input: string) => Promise<T>;
  choices?: () => Promise<string[]>;
  default?: () => Promise<T>;
}

export interface InputFlagOpts<T> extends FlagOpts {
  /**
   * a set of possible options that can be used for the flag value
   * anything else will error
   * */
  choices?: string[] | (() => string[]) | (() => Promise<string[]>);
  /** instead of returning a string to the command, run some logic first */
  parse?: ((input: string) => T) | ((input: string) => Promise<T>);
  /**
   * if the flag is not specified, use this value instead
   */
  default?: T | (() => T) | (() => Promise<T>);
}

export type Flag<T> = BoolFlag | InputFlag<T>;
export type Flags = { [name: string]: Flag<any> };

interface Opts {
  flags: Flags;
  flagArr: Flag<any>[];
  name?: string;
  main: boolean;
}
