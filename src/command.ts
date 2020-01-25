import type { Arg, RestArg } from './args'
import type { Flags } from './flags'
import type { Options } from './options'
import parse from './parse'

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

export interface Command<TArgs extends any[]> {
  run(argv: string[], run?: CommandRun<TArgs>): void
  run(run?: CommandRun<TArgs>): void
}

export interface CommandRun<TArgs extends any[]> {
  (params: {args: TArgs, flags: {}}): any
}

export const oclip: Oclip = (options: Options<any, any> = {}) => {
  return {
    async run(argv: string[] | CommandRun<any> = process.argv, run?: CommandRun<any>) {
      if (typeof argv === 'function') {
        run = argv
        argv = process.argv
      }
      if (!run) return
      if (argv === process.argv) argv = argv.slice(2)
      const {args, flags} = await parse(options, argv)
      const result = await run({args, flags})
      return result
    }
  }
}
