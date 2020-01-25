import { Arg, RestArg } from './args'
import { Flags } from './flags'
import { Options } from './options'
import parse from './parse'

export class Command<TArgs extends any[]> {
  constructor(readonly options: Options<any, any>) {
    options.args = options.args || []
  }

  async run<TReturn>(argv: string[], run?: CommandRun<TArgs, TReturn>): Promise<TReturn>
  async run<TReturn>(run?: CommandRun<TArgs, TReturn>): Promise<TReturn>
  async run<TReturn>(argv?: string[] | CommandRun<TArgs, TReturn>, run?: CommandRun<TArgs, TReturn>): Promise<TReturn> {
    if (typeof argv === 'function') {
      run = argv
      argv = process.argv
    }
    if (!argv) argv = process.argv
    if (argv === process.argv) argv = argv.slice(2)
    const {args, flags} = await parse(this.options, argv) as any
    const ctx = {
      command: this,
    }
    if (!run) return undefined as any
    const result = await run({args, flags, ctx})
    return result
  }
}

export type ArgVal<A extends Arg<any>> = A extends {required: false} ? ReturnType<A['parse']> | undefined : ReturnType<A['parse']>

export interface Oclip {
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, A5 extends RestArg<any>>(options: Options<[A1, A2, A3, A4, A5], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>, ...ArgVal<A5>[]]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, A5 extends Arg<any>>(options: Options<[A1, A2, A3, A4, A5], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>, ArgVal<A5>]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends RestArg<any>>(options: Options<[A1, A2, A3, A4], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ...ArgVal<A4>[]]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>>(options: Options<[A1, A2, A3, A4], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends RestArg<any>>(options: Options<[A1, A2, A3], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ...ArgVal<A3>[]]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>>(options: Options<[A1, A2, A3], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends RestArg<any>>(options: Options<[A1, A2], TFlags>): Command<[ArgVal<A1>, ...ArgVal<A2>[]]>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>>(options: Options<[A1, A2], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>]>
  <TFlags extends Flags, A1 extends RestArg<any>>(options: Options<[A1], TFlags>): Command<ArgVal<A1>[]>
  <TFlags extends Flags, A1 extends Arg<any>>(options: Options<[A1], TFlags>): Command<[ArgVal<A1>]>
  <TFlags extends Flags>(options?: Options<[], TFlags>): Command<[]>
  <TFlags extends Flags, A extends Arg<any>>(options?: Options<A[], TFlags>): Command<ArgVal<A>[]>
}

export interface CommandRun<TArgs extends any[], TReturn> {
  (params: RunParams<TArgs>): Promise<TReturn> | TReturn
}

export interface RunParams<TArgs extends any[]> {
  args: TArgs
  flags: {}
  ctx: RunContext<TArgs>
}

export interface RunContext<TArgs extends any[]> {
  command: Command<TArgs>
}

export const oclip: Oclip = (options: Options<any, any> = {}) => new Command(options) as any
