import { Arg, RestArg, } from './args'
import { Flags } from './flags'
import parse from './parse'
import * as os from 'os'

export class Command<F extends Flags, R> {
  constructor(options: Options<any, F, R, []>) {
    this.options = {
      args: [],
      flags: {} as F,
      run: () => undefined as any,
      ...options,
    }
  }
  readonly options: FullOptions<any, F, R, []>

  async parse(argv = process.argv.slice(2)) {
    const {args, flags} = await parse(this.options, argv) as any
    const ctx = {
      dirs: {
        home: os.homedir(),
      },
      command: this,
    }
    const result: any = await this.options.run({args, flags, ctx})
    return result
  }
}

export const oclip: Oclip = <O extends Options<any, any, any, any>>(options: O) => new Command(options) as any

export type ArgVal<A extends Arg<any>> = A extends {required: false} ? ReturnType<A['parse']> | undefined : ReturnType<A['parse']>

export interface Oclip {
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, A5 extends RestArg<any>, R>(options: Options<[A1, A2, A3, A4, A5], F, R, [ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>, ...ArgVal<A5>[]]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, A5 extends Arg<any>, R>(options: Options<[A1, A2, A3, A4, A5], F, R, [ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>, ArgVal<A5>]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends RestArg<any>, R>(options: Options<[A1, A2, A3, A4], F, R, [ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ...ArgVal<A4>[]]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, A4 extends Arg<any>, R>(options: Options<[A1, A2, A3, A4], F, R, [ArgVal<A1>, ArgVal<A2>, ArgVal<A3>, ArgVal<A4>]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends RestArg<any>, R>(options: Options<[A1, A2, A3], F, R, [ArgVal<A1>, ArgVal<A2>, ...ArgVal<A3>[]]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, A3 extends Arg<any>, R>(options: Options<[A1, A2, A3], F, R, [ArgVal<A1>, ArgVal<A2>, ArgVal<A3>]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends RestArg<any>, R>(options: Options<[A1, A2], F, R, [ArgVal<A1>, ...ArgVal<A2>[]]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, R>(options: Options<[A1, A2], F, R, [ArgVal<A1>, ArgVal<A2>]>): Command<F, R>
  <F extends Flags, A1 extends RestArg<any>, R>(options: Options<[A1], F, R, ArgVal<A1>[]>): Command<F, R>
  <F extends Flags, A1 extends Arg<any>, R>(options: Options<[A1], F, R, [ArgVal<A1>]>): Command<F, R>
  <F extends Flags, R>(options?: Options<[], F, R, []>): Command<F, R>
  <F extends Flags, A extends Arg<any>, R>(options?: Options<A[], F, R, ArgVal<A>[]>): Command<F, R>
}

export interface FullOptions<A extends Arg<any>[], F extends Flags, R, AParams extends any[]> {
  args: A
  flags: F
  run: RunFunc<AParams, F, R>
}
export type Options<A extends Arg<any>[], F extends Flags, R, AParams extends any[]> = Partial<FullOptions<A, F, R, AParams>>

export interface RunFunc<AParams extends any[], F extends Flags, R> {
  (params: RunParams<AParams, F>): Promise<R> | R
}
export interface RunParams<TArgs extends any[], F extends Flags> {
  args: TArgs
  flags: {}
  ctx: RunContext<F>
}

export interface RunContext<F extends Flags> {
  dirs: {
    home: string
  }
  command: Command<F, any>
}
