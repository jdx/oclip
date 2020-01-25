import { Arg, } from './args'
import { Flags } from './flags'
import { Command } from './command'

export interface Options<A extends Arg<any>[], F extends Flags, R, AParams extends any[]> {
  args?: A
  flags?: F
  run?(params: RunParams<AParams, F>): Promise<R> | R
}

export type FullOptions<A extends Arg<any>[], F extends Flags, R, AParams extends any[]> = Options<A, F, R, AParams> & {
  args: A
  flags: F
  run(params: RunParams<AParams, F>): Promise<R> | R
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
