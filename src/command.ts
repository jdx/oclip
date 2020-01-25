import { Arg, RestArg } from './args'
import { Flags } from './flags'
import { FullOptions, Options } from './options'
import parse from './parse'
import * as os from 'os'

export class Command<TArgs extends any[], F extends Flags> {
  constructor(readonly options: FullOptions<{[N in keyof TArgs]: Arg<TArgs[N]>}, F>) {
    this.options = this.options || {}
    this.options.args = this.options.args || [] as any
  }

  async run<R>(argv: string[] | CommandRun<TArgs, any, F, R> = process.argv, run?: CommandRun<TArgs, any, F, R>) {
    if (typeof argv === 'function') run = argv
    if (!argv || typeof argv === 'function') argv = process.argv
    if (argv === process.argv) argv = argv.slice(2)
    const {args, flags} = await parse(this.options, argv) as any
    const ctx = {
      dirs: {
        home: os.homedir(),
      },
      command: this,
    }
    if (!run) return undefined as any
    const result: any = await run({args, flags, ctx})
    return result
  }
}

export const oclip: Oclip = <O extends Options<any, any>>(options: O) => new Command(options) as any

export type ArgVal<A extends Arg<any>> = A extends {required: false} ? ReturnType<A['parse']> | undefined : ReturnType<A['parse']>

export interface Oclip {
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, A5 extends RestArg<any>>(options: Options<[A1, A2, A3, A4, A5], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>, ...ArgVal<A5>[]], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, A5 extends Arg<any>>(options: Options<[A1, A2, A3, A4, A5], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>, ArgVal<A5>], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends RestArg<any>>(options: Options<[A1, A2, A3, A4], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ...ArgVal<A4>[]], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>>(options: Options<[A1, A2, A3, A4], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends RestArg<any>>(options: Options<[A1, A2, A3], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ...ArgVal<A3>[]], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>>(options: Options<[A1, A2, A3], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>, ArgVal<A3>], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends RestArg<any>>(options: Options<[A1, A2], TFlags>): Command<[ArgVal<A1>, ...ArgVal<A2>[]], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>, A2 extends Arg<any>>(options: Options<[A1, A2], TFlags>): Command<[ArgVal<A1>, ArgVal<A2>], TFlags>
  <TFlags extends Flags, A1 extends RestArg<any>>(options: Options<[A1], TFlags>): Command<ArgVal<A1>[], TFlags>
  <TFlags extends Flags, A1 extends Arg<any>>(options: Options<[A1], TFlags>): Command<[ArgVal<A1>], TFlags>
  <TFlags extends Flags>(options?: Options<[], TFlags>): Command<[], Flags>
  <TFlags extends Flags, A extends Arg<any>>(options?: Options<A[], TFlags>): Command<ArgVal<A>[], TFlags>
}

export interface CommandRun<TArgs extends any[], A extends Arg<any>[], F extends Flags, R> {
  (params: RunParams<TArgs, A, F>): Promise<R> | R
}

export interface RunParams<TArgs extends any[], A extends Arg<any>[], F extends Flags> {
  args: TArgs
  flags: {}
  ctx: RunContext<A, F>
}

export interface RunContext<A extends Arg<any>[], F extends Flags> {
  dirs: {
    home: string
  }
  command: Command<A, F>
}
