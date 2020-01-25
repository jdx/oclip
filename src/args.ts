export interface Arg<T> {
  name?: string
  description?: string
  parse(input: string): T
  required: boolean
  choices?: string[]
  default?: T | (() => T)
  rest?: boolean
}
export type RestArg<T> = Arg<T> & {rest: true, required: false}
export type OptionalArg<T> = Arg<T> & {required: false}
export type RequiredArg<T> = Arg<T> & {required: true}

export interface ArgOpts<T> {
  parse?: (input: string) => T
  choices?: string[]
  default?: T | (() => T)
}

export interface ArgBuilder<U=string> {
  <T=U>(name: string, description: string, options?: ArgOpts<T>): Arg<T>
  <T=U>(name: string, options?: ArgOpts<T>): Arg<T>
  <T=U>(options?: ArgOpts<T>): Arg<T>

  required <T=U>(name: string, description: string, options?: ArgOpts<T>): RequiredArg<T>
  required <T=U>(name: string, options?: ArgOpts<T>): RequiredArg<T>
  required <T=U>(options?: ArgOpts<T>): RequiredArg<T>

  optional <T=U>(name: string, description: string, options?: ArgOpts<T>): OptionalArg<T>
  optional <T=U>(name: string, options?: ArgOpts<T>): OptionalArg<T>
  optional <T=U>(options?: ArgOpts<T>): OptionalArg<T>

  rest <T=U>(name: string, description: string, options?: ArgOpts<T>): RestArg<T>
  rest <T=U>(name: string, options?: ArgOpts<T>): RestArg<T>
  rest <T=U>(options?: ArgOpts<T>): RestArg<T>

  extend <T=U>(options?: ArgOpts<T>): ArgBuilder<T>
}

const getParams = (name?: string | ArgOpts<any>, description?: string | ArgOpts<any>, options?: ArgOpts<any>): [string | undefined, string | undefined, ArgOpts<any>] => {
  if (typeof name === 'object') return [undefined, undefined, name]
  if (typeof description === 'object') return [name, undefined, description]
  return [name, description, options || {}]
}

function argBuilder<T>(defaultOptions: ArgOpts<T> & {parse: (input: string) => T}): ArgBuilder<T> {
  const arg: ArgBuilder = (name?: string | ArgOpts<any>, description?: string | ArgOpts<any>, options: ArgOpts<any> = {}): Arg<any> => {
    [name, description, options] = getParams(name, description, options)
    return {
      ...defaultOptions,
      required: true,
      ...options,
      name,
      description,
    }
  }

  arg.required = (name?: any, description?: any, options: any = {}) => {
    [name, description, options] = getParams(name, description, options)
    return arg(name, description, {...defaultOptions, ...options, required: true}) as any
  }
  arg.optional = (name?: any, description?: any, options: any = {}) => {
    [name, description, options] = getParams(name, description, options)
    return arg(name, description, {...defaultOptions, ...options, required: false}) as any
  }
  arg.rest = (name?: any, description?: any, options: any = {}): RestArg<any> => {
    [name, description, options] = getParams(name, description, options)
    return arg(name, description, {...defaultOptions, ...options, required: false, rest: true}) as any
  }
  arg.extend = (options: any = {}) => argBuilder({...defaultOptions, ...options})

  return arg
}

export const arg = argBuilder({parse: s => s})

export const parseArgs = async (input: string[], args: Arg<any>[]): Promise<any[]> => {
  const output = [] as any[]
  for (let i=0; i<input.length; i++) {
    let o = input[i]
    const arg = args[i] || args[args.length-1]
    if (o !== undefined && arg) {
      o = arg.parse(o)
    }
    output.push(o)
  }
  return output
}
