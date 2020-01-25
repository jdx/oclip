import type { AlphabetLowercase, AlphabetUppercase } from './alphabet'

export type Flags = {[id: string]: Flag<any>}

export type Flag<T> = BooleanFlag<T> | InputFlag<T>

export type FlagValues<F extends Flags> = {[K in keyof F]?: UnwrapPromise<ReturnType<F[K]['parse']>> }

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export interface FlagOpts<T> {
  required?: boolean
  dependsOn?: string[]
  exclusive?: string[]
  hidden?: boolean
  parse?: ((input: string) => T) | ((input: string) => Promise<T>)
  choices?: string[] | (() => string[] | Promise<string[]>)
  default?: T | (() => T | Promise<T>)
}

export interface BooleanFlagOpts<T> extends FlagOpts<T> {
  allowNo?: boolean
}

export interface InputFlagOpts<T> extends FlagOpts<T> {
  multiple?: boolean
  choices?: string[] | (() => string[] | Promise<string[]>)
}

export interface FlagBase<T> {
  name: string
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  required: boolean
  dependsOn?: string[]
  exclusive?: string[]
  hidden?: boolean
  parse: ((input: string) => T) | ((input: string) => Promise<T>)
  choices?: string[] | (() => string[] | Promise<string[]>)
  default?: T | (() => T | Promise<T>)
}

export interface BooleanFlag<T> extends FlagBase<T> {
  type: 'boolean'
  /** allow the user to also run: --no-flag-name in order to set the flag to false */
  allowNo: boolean
}

export interface InputFlag<T> extends FlagBase<T> {
  type: 'input'
  helpValue?: string
  /** can this flag be specified multiple times? If so, returns an array of values */
  multiple: boolean
  choices?: string[] | (() => string[] | Promise<string[]>)
}

export type MultipleFlag<T> = InputFlag<T> & {multiple: true}

export function boolean<T> (opts: BooleanFlagOpts<T>): BooleanFlag<T>
export function boolean (opts?: BooleanFlagOpts<boolean>): BooleanFlag<boolean>
export function boolean (opts: BooleanFlagOpts<any> = {}): BooleanFlag<any> {
  return {
    allowNo: false,
    required: false,
    parse(input) {
      if (this.allowNo && input === `--no-${this.name}`) {
        return false
      }
      return true
    },
    ...opts,
    name: '',
    type: 'boolean',
  }
}

export function input<T> (opts: InputFlagOpts<T>): InputFlag<T>
export function input (opts?: InputFlagOpts<string>): InputFlag<string>
export function input<T=string> (opts: InputFlagOpts<T> = {}): InputFlag<T> {
  return {
    required: false,
    multiple: false,
    parse: (s: string) => s as any,
    ...opts,
    name: '',
    type: 'input',
  }
}
