import { Arg, RestArg, arg } from './args'
import { Flags } from './flags'
import { FullOptions, Options } from './options'
import parse from './parse'
import * as os from 'os'

export class Command<F extends Flags, R> {
  constructor(readonly options: FullOptions<any, F, R, []>) {
    this.options = this.options || {}
    this.options.args = this.options.args || [] as any
    this.options.run = this.options.run || (() => {})
  }

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

export const oclip: Oclip = <O extends Options<any, any, any, any>>(options: O) => new Command(options as any) as any

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
