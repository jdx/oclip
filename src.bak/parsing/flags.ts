import type { Alphabet } from './alphabet';

export type Flags = { [id: string]: Flag<any> };

export type Flag<T> = BoolFlag | InputFlag<T>;

export type BoolFlagValue<F extends BoolFlag> = F extends { multiple: true }
  ? number
  : F extends { required: true }
  ? true
  : boolean;

export type InputFlagValue<F extends InputFlag<any>> = F extends {
  required: true;
}
  ? UnwrapPromise<ReturnType<F['parse']>>
  : F extends MultipleFlag<infer T>
  ? T[]
  : UnwrapPromise<F['parse']> | undefined;

export type FlagValue<F extends Flag<any>> = F extends InputFlag<any>
  ? InputFlagValue<F>
  : F extends BoolFlag
  ? BoolFlagValue<F>
  : never;

export type FlagValues<F extends Flags> = { [K in keyof F]: FlagValue<F[K]> };

export type MultipleFlag<T> = Flag<T> & { multiple: true };
export type MultiBoolFlag = BoolFlag & { multiple: true };
export type RequiredFlag<T> = Flag<T> & { required: true };
export type OptionalFlag<T> = Flag<T> & { required: false };

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

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

export interface BoolFlagOpts extends FlagOpts {
  /** allow the user to set `--no-thisflag` to set it to false */
  allowNo?: boolean;
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

export interface FlagBase {
  /**
   * the name is the key of the object the flag is specified in.
   * It will be set automatically by oclip.
   */
  name: string;
  /**
   * A short flag name (e.g.: `-f` instead of `--file`)
   */
  char?: Alphabet;
  /** a short description of what this flag does for help */
  description?: string;
  /** set to true to require the flag to be set on a command */
  required: boolean;
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
  /** pretty print flag
   * mainly for use in help and error messages */
  toString(): string;
  /** can this flag be specified multiple times? If so, returns an array of values */
  multiple: boolean;
}

export interface BoolFlag extends FlagBase {
  type: 'boolean';
  /** allow the user to also run: --no-flag-name in order to set the flag to false */
  allowNo: boolean;
}

export interface InputFlag<T> extends FlagBase {
  type: 'input';
  /** the help text for a flags's value, e.g.: --file=*FILENAME* */
  helpValue?: string;
  /** instead of returning a string to the command, run some logic first */
  parse: (input: string) => Promise<T>;
  /**
   * a set of possible options that can be used for the flag value
   * anything else will error
   * */
  choices?: () => Promise<string[]>;
  /**
   * if the flag is not specified, use this value instead
   */
  default?: () => Promise<T>;
}

export interface FlagBuilder<U = string> {
  <T = U>(
    char: Alphabet,
    description: string,
    options?: InputFlagOpts<T>,
  ): InputFlag<T>;
  <T = U>(char: Alphabet, options?: InputFlagOpts<T>): InputFlag<T>;
  <T = U>(options?: InputFlagOpts<T>): InputFlag<T>;

  required<T = U>(
    char: Alphabet,
    description: string,
    options?: InputFlagOpts<T>,
  ): RequiredFlag<T>;
  required<T = U>(char: Alphabet, options?: InputFlagOpts<T>): RequiredFlag<T>;
  required<T = U>(options?: InputFlagOpts<T>): RequiredFlag<T>;

  optional<T = U>(
    char: Alphabet,
    description: string,
    options?: InputFlagOpts<T>,
  ): OptionalFlag<T>;
  optional<T = U>(char: Alphabet, options?: InputFlagOpts<T>): OptionalFlag<T>;
  optional<T = U>(options?: InputFlagOpts<T>): OptionalFlag<T>;

  multiple<T = U>(
    char: Alphabet,
    description: string,
    options?: InputFlagOpts<T>,
  ): MultipleFlag<T>;
  multiple<T = U>(char: Alphabet, options?: InputFlagOpts<T>): MultipleFlag<T>;
  multiple<T = U>(options?: InputFlagOpts<T>): MultipleFlag<T>;

  extend<T = U>(options?: InputFlagOpts<T>): FlagBuilder<T>;
}

function flagBuilder<T>(
  defaultOptions: InputFlagOpts<T> & { parse: (input: string) => T },
): FlagBuilder<T> {
  const flag: FlagBuilder = (
    char?: Alphabet | InputFlagOpts<T>,
    description?: string | InputFlagOpts<T>,
    options: InputFlagOpts<T> = {},
  ): InputFlag<T> => {
    options = getParams(char, description, options);
    const flag: InputFlag<T> = {
      toString() {
        const types = [];
        if (this.char) types.push(`-${this.char}`);
        if (this.name) {
          types.push(`--${this.name}`);
        }
        return types.join(', ') || 'UNKNOWN FLAG';
      },
      ...defaultOptions,
      multiple: false,
      required: false,
      ...options,
      parse: async (s: string) =>
        (options.parse || defaultOptions.parse || ((s: string) => s))(s),
      choices: standardizeChoices(options.choices, defaultOptions.choices),
      default: standardizeChoices(options.default, defaultOptions.default),
      type: 'input',
      name: '',
    };
    return flag;
  };

  flag.required = (char?: any, description?: any, options: any = {}) => {
    options = getParams(char, description, options);
    return flag(char, {
      ...defaultOptions,
      description,
      ...options,
      required: true,
    }) as any;
  };
  flag.optional = (char?: any, description?: any, options: any = {}) => {
    options = getParams(char, description, options);
    return flag(char, {
      ...defaultOptions,
      description,
      ...options,
      required: false,
    }) as any;
  };
  flag.multiple = (
    char?: any,
    description?: any,
    options: any = {},
  ): MultipleFlag<any> => {
    options = getParams(char, description, options);
    return flag(char, {
      ...defaultOptions,
      description,
      ...options,
      required: false,
      multiple: true,
    }) as any;
  };
  flag.extend = (options: any = {}) =>
    flagBuilder({ ...defaultOptions, ...options });

  return flag;
}

const getParams = <T extends { char?: string; description?: string }>(
  char: undefined | Alphabet | T,
  description: undefined | string | T,
  options: T,
): T => {
  if (typeof char === 'object') return char;
  if (typeof description === 'object') return { ...description, char };
  return { ...options, char, description };
};

export const flag: FlagBuilder & {
  multibool(
    char: Alphabet,
    description: string,
    options?: BoolFlagOpts,
  ): MultiBoolFlag;
  multibool(char: Alphabet, options?: BoolFlagOpts): MultiBoolFlag;
  multibool(options?: BoolFlagOpts): MultiBoolFlag;

  bool(char: Alphabet, description: string, options?: BoolFlagOpts): BoolFlag;
  bool(char: Alphabet, options?: BoolFlagOpts): BoolFlag;
  bool(options?: BoolFlagOpts): BoolFlag;
} = flagBuilder({ parse: (s: string) => s }) as any;

/**
 * A simple flag that just allows the user to set a boolean. `allowNo` enabled "false" support with:
 * --no-flagname
 * @param {BoolFlagOpts} opts
 */
flag.bool = (
  char?: Alphabet | BoolFlagOpts,
  description?: string | BoolFlagOpts,
  opts: BoolFlagOpts = {},
) => {
  opts = getParams(char, description, opts);
  return {
    allowNo: false,
    required: false,
    multiple: false,
    toString() {
      const types = [];
      if (this.char) types.push(`-${this.char}`);
      if (this.name) {
        types.push(`--${this.name}`);
        if (this.allowNo) types.push(`--no-${this.name}`);
      }
      return types.join(', ') || 'UNKNOWN FLAG';
    },
    ...opts,
    name: '',
    type: 'boolean' as const,
  };
};

/**
 * A simple flag that just allows the user to set a boolean. `allowNo` enabled "false" support with:
 * --no-flagname
 * @param {BoolFlagOpts} opts
 */
flag.multibool = (
  char?: Alphabet | BoolFlagOpts,
  description?: string | BoolFlagOpts,
  opts: BoolFlagOpts = {},
) => {
  return {
    ...flag.bool(char as Alphabet, description as string, opts),
    multiple: true,
  } as any;
};

/**
 * converts choice options from various input into function returning promise of strings
 */
function standardizeChoices<T>(
  ...options: (undefined | T | (() => T) | (() => Promise<T>))[]
): (() => Promise<T>) | undefined {
  const input = options.find((o) => !!o);
  if (!input) return;
  return async () => (typeof input === 'function' ? (input as any)() : input);
}
