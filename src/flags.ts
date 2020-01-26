import type { Alphabet } from './alphabet'

export type Flags = {[id: string]: Flag<any>}

export type Flag<T> = BooleanFlag<T> | InputFlag<T>

export type FlagValues<F extends Flags> =
  {[K in keyof F]: F[K] extends {required: true} ?
  UnwrapPromise<ReturnType<F[K]['parse']>> :
  F[K] extends Multiple<InputFlag<infer T>> ? T[] :
  UnwrapPromise<ReturnType<F[K]['parse']>> | undefined}

export type Multiple<T> = T & {multiple: true}
export type Required<T> = T & {required: true}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export interface FlagOpts<T> {
  /** a short description of what this flag does for help */
  description?: string
  /** set to true to require the flag to be set on a command */
  required?: boolean
  /** this flag must also have another flag set or the CLI will error out */
  dependsOn?: string[]
  /** the flag may not be run if these other flags are set */
  exclusive?: string[]
  /**
   * allow the user to use the flag but don't display it in the help.
   * This is helpful when you want to release something to try out but don't
   * want to document it to keep users from discovering it
   */
  hidden?: boolean
  /** instead of returning a string to the command, run some logic first */
  parse?: ((input: string) => T) | ((input: string) => Promise<T>)
  /**
   * a set of possible options that can be used for the flag value
   * anything else will error
   * */
  choices?: string[] | (() => string[] | Promise<string[]>)
  /**
   * if the flag is not specified, use this value instead
   */
  default?: T | (() => T | Promise<T>)
}

export interface BooleanFlagOpts<T> extends FlagOpts<T> {
  /** allow the user to set `--no-thisflag` to set it to false */
  allowNo?: boolean
}

export interface InputFlagOpts<T> extends FlagOpts<T> {
  /**
   * this flag can be set multiple times.
   * This will provide the command an array instead of a value.
   * */
  multiple?: boolean
  /**
   * a set of possible options that can be used for the flag value
   * anything else will error
   * */
  choices?: string[] | (() => string[] | Promise<string[]>)
}

export interface FlagBase<T> {
  /**
   * the name is the key of the object the flag is specified in.
   * It will be set automatically by oclip.
   */
  name: string
  /**
   * A short flag name (e.g.: `-f` instead of `--file`)
   */
  char?: Alphabet
  /** a short description of what this flag does for help */
  description?: string
  /** set to true to require the flag to be set on a command */
  required: boolean
  /** this flag must also have another flag set or the CLI will error out */
  dependsOn?: string[]
  /** the flag may not be run if these other flags are set */
  exclusive?: string[]
  /**
   * allow the user to use the flag but don't display it in the help.
   * This is helpful when you want to release something to try out but don't
   * want to document it to keep users from discovering it
   */
  hidden?: boolean
  /** instead of returning a string to the command, run some logic first */
  parse: ((input: string) => T) | ((input: string) => Promise<T>)
  /**
   * a set of possible options that can be used for the flag value
   * anything else will error
   * */
  choices?: string[] | (() => string[] | Promise<string[]>)
  /**
   * if the flag is not specified, use this value instead
   */
  default?: T | (() => T | Promise<T>)
  /** pretty print flag
   * mainly for use in help and error messages */
  toString(): string
}

export interface BooleanFlag<T> extends FlagBase<T> {
  type: 'boolean'
  /** allow the user to also run: --no-flag-name in order to set the flag to false */
  allowNo: boolean
}

export interface InputFlag<T> extends FlagBase<T> {
  type: 'input'
  /** the help text for a flags's value, e.g.: --file=*FILENAME* */
  helpValue?: string
  /** can this flag be specified multiple times? If so, returns an array of values */
  multiple: boolean
  /**
   * a set of possible options that can be used for the flag value
   * anything else will error
   * */
  choices?: string[] | (() => string[] | Promise<string[]>)
}

/**
 * A simple flag that just allows the user to set a boolean. `allowNo` enabled "false" support with:
 * --no-flagname
 * @param char A short flag name (e.g.: `-f` instead of `--file`)
 * @param description short description of what this flag does for help
 * @param opts See BooleanFlagOpts and FlagOpts for available options
 */
export function boolean<T> (char: Alphabet, description: string, opts: BooleanFlagOpts<T>): BooleanFlag<T>
export function boolean<T> (char: Alphabet, opts: BooleanFlagOpts<T>): BooleanFlag<T>
export function boolean<T> (opts: BooleanFlagOpts<T>): BooleanFlag<T>
export function boolean (char?: Alphabet, description?: string, opts?: BooleanFlagOpts<boolean>): BooleanFlag<boolean>
export function boolean (char?: Alphabet, opts?: BooleanFlagOpts<boolean>): BooleanFlag<boolean>
export function boolean (opts?: BooleanFlagOpts<boolean>): BooleanFlag<boolean>
export function boolean (char?: Alphabet | BooleanFlagOpts<any>, description?: string | BooleanFlagOpts<any>, opts: BooleanFlagOpts<any> = {}): BooleanFlag<any> {
  [char, description, opts] = getParams(char, description, opts)
  return {
    allowNo: false,
    required: false,
    toString() {
      let types = []
      if (this.char) types.push(`-${this.char}`)
      if (this.name) {
        types.push(`--${this.name}`)
        if (this.allowNo) types.push(`--no-${this.name}`)
      }
      return types.join(', ') || 'UNKNOWN FLAG'
    },
    parse(input) {
      if (this.allowNo && input === `--no-${this.name}`) {
        return false
      }
      return true
    },
    char: char as Alphabet,
    description: description as string,
    ...opts,
    name: '',
    type: 'boolean',
  }
}

/**
 * A flag that allows the user to input data. e.g.: `--file=FILENAME`. Can also be specified with
 * `--file FILENAME`, `-f FILENAME`, `-fFILENAME`.
 * @param char A short flag name (e.g.: `-f` instead of `--file`)
 * @param description short description of what this flag does for help
 * @param opts See InputFlagOpts and FlagOpts for available options
 */
export function input<T> (char: Alphabet, description: string, opts: Multiple<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Multiple<InputFlag<T>>
export function input<T> (char: Alphabet, opts: Multiple<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Multiple<InputFlag<T>>
export function input<T> (opts: Multiple<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Multiple<InputFlag<T>>
export function input<T> (char: Alphabet, description: string, opts: Required<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Required<InputFlag<T>>
export function input<T> (char: Alphabet, opts: Required<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Required<InputFlag<T>>
export function input<T> (opts: Required<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Required<InputFlag<T>>
export function input<T> (char: Alphabet, description: string, opts: InputFlagOpts<T> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): InputFlag<T>
export function input<T> (char: Alphabet, opts: InputFlagOpts<T> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): InputFlag<T>
export function input<T> (opts: InputFlagOpts<T> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): InputFlag<T>
export function input (char: Alphabet, description: string, opts: Multiple<InputFlagOpts<any>>): Multiple<InputFlag<string>>
export function input (char: Alphabet, opts: Multiple<InputFlagOpts<any>>): Multiple<InputFlag<string>>
export function input (opts: Multiple<InputFlagOpts<any>>): Multiple<InputFlag<string>>
export function input (char: Alphabet, description: string, opts: Required<InputFlagOpts<any>>): Required<InputFlag<string>>
export function input (char: Alphabet, opts: Required<InputFlagOpts<any>>): Required<InputFlag<string>>
export function input (opts: Required<InputFlagOpts<any>>): Required<InputFlag<string>>
export function input (opts: InputFlagOpts<any>): InputFlag<string>
export function input (char: Alphabet, description: string, opts: InputFlagOpts<any>): InputFlag<string>
export function input (char: Alphabet, opts: InputFlagOpts<any>): InputFlag<string>
export function input (char?: Alphabet, description?: string, opts?: InputFlagOpts<string>): InputFlag<string>
export function input (char?: Alphabet, opts?: InputFlagOpts<string>): InputFlag<string>
export function input (opts?: InputFlagOpts<string>): InputFlag<string>
export function input<T=string> (char?: Alphabet | InputFlagOpts<T>, description?: string | InputFlagOpts<T>, opts?: InputFlagOpts<T>): InputFlag<T> {
  [char, description, opts] = getParams(char, description, opts)
  const flag: InputFlag<T> = {
    required: false,
    multiple: false,
    toString() {
      let types = []
      if (this.char) types.push(`-${this.char}`)
      if (this.name) {
        types.push(`--${this.name}`)
      }
      return types.join(', ') || 'UNKNOWN FLAG'
    },
    parse: (s: string) => s as any,
    char: char as Alphabet,
    description: description as string,
    ...opts,
    name: '',
    type: 'input',
  }
  if (flag.multiple && flag.default === undefined) flag.default = (async () => [] as any)
  return flag
}

const getParams = <T extends object>(char?: Alphabet | T, description?: string | T, options?: T): [Alphabet | undefined, string | undefined, T] => {
  if (typeof char === 'object') return [undefined, undefined, char]
  if (typeof description === 'object') return [char, undefined, description]
  return [char, description, options || {} as T]
}
