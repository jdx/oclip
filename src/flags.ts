import type { AlphabetLowercase, AlphabetUppercase } from './alphabet'

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
  description?: string
  required?: boolean
  dependsOn?: string[]
  exclusive?: string[]
  hidden?: boolean
  parse?: ((input: string) => T) | ((input: string) => Promise<T>)
  choices?: string[] | (() => string[] | Promise<string[]>)
  default?: T | (() => T | Promise<T>)
  toString(): string
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

export function boolean<T> (opts: BooleanFlagOpts<T>): BooleanFlag<T>
export function boolean (opts?: BooleanFlagOpts<boolean>): BooleanFlag<boolean>
export function boolean (opts: BooleanFlagOpts<any> = {}): BooleanFlag<any> {
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
    ...opts,
    name: '',
    type: 'boolean',
  }
}

export function input<T> (opts: Multiple<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Multiple<InputFlag<T>>
export function input<T> (opts: Required<InputFlagOpts<T>> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): Required<InputFlag<T>>
export function input<T> (opts: InputFlagOpts<T> & {parse: ((input: string) => T) | ((input: string) => Promise<T>)}): InputFlag<T>
export function input (opts: Multiple<InputFlagOpts<any>>): Multiple<InputFlag<string>>
export function input (opts: Required<InputFlagOpts<any>>): Required<InputFlag<string>>
export function input (opts: InputFlagOpts<any>): InputFlag<string>
export function input (opts?: InputFlagOpts<string>): InputFlag<string>
export function input<T=string> (opts: InputFlagOpts<T> = {}): InputFlag<T> {
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
    ...opts,
    name: '',
    type: 'input',
  }
  if (flag.multiple && flag.default === undefined) flag.default = (async () => [] as any)
  return flag
}
