import { validateArgDefs, Args, Arg, MultipleArg } from '../parsing/args'
import parse from '../parsing/parse'
import Context from '../context'
import { Flags, FlagValues } from '../parsing/flags'
import { BaseOptions, Topic } from '../topic'

export interface CommandOptions<A extends Args = any[], F extends Flags = any, TArgs extends any[] = any[], R=any> extends BaseOptions<A, F> {
  run(params: RunParams<TArgs, F>): Promise<R> | R
}

export class Command {
  constructor(options: CommandOptions<any, any>) {
    this.run = options.run
    this.args = options.args || []
    this.flags = options.flags || {}
    this.description = options.description
    validateArgDefs(this.args)
  }
  readonly run: (params: RunParams<any[], any>) => any
  readonly args: Args
  readonly flags: Flags
  type = 'command' as const
  description?: string
  id?: string
  parent?: Topic

  async exec(argv = process.argv.slice(2)): Promise<any> {
    const ctx = new Context(this)
    const {args, flags} = await parse(ctx, argv, this.args, this.flags)
    const result: any = await this.run({args: args as any, flags: flags as any, ctx})
    return result
  }

  usage(ctx: Context): string {
    const args = this.args.map(a => a.toString({usage: true}))
    return [ctx.subjectPath(), ...args].join(' ')
  }
}

export interface RunParams<TArgs extends any[], F extends Flags> {
  args: TArgs
  flags: FlagValues<F>
  ctx: Context
}

export function command<F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, R>(options: CommandOptions<[A1, A2], F, [ArgVal<A1>, ArgVal<A2>], R>): Command
export function command<F extends Flags, A1 extends MultipleArg<any>, R>(options: CommandOptions<[A1], F, ArgVal<A1>[], R>): Command
export function command<F extends Flags, A1 extends Arg<any>, R>(options: CommandOptions<[A1], F, [ArgVal<A1>], R>): Command
export function command<F extends Flags, R>(options: CommandOptions<[], F, [], R>): Command
export function command<F extends Flags, A extends Arg<any>, R>(options: CommandOptions<A[], F, ArgVal<A>[], R>): Command
export function command(opts: CommandOptions): Command {
  return new Command(opts)
}

export type ArgVal<A extends Arg<any>> = A extends {required: false} ? ReturnType<A['parse']> | undefined : ReturnType<A['parse']>
