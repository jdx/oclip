import { validateArgDefs, Args, Arg, RestArg } from '../parsing/args'
import parse from '../parsing/parse'
import { VersionSignal } from '../signals'
import Context from '../context'
import { Flags, FlagValues } from '../parsing/flags'
import { BaseOptions, Topic } from '../topic'
import { HelpSignal } from '../signals'

export interface CommandOptions<A extends Args = any[], F extends Flags = any, TArgs extends any[] = any[], R=any> extends BaseOptions<A, F> {
  run(params: RunParams<TArgs, F>): Promise<R> | R
}

export class Command {
  constructor(options: CommandOptions<any, any>) {
    this.run = options.run
    this.args = options.args || []
    this.flags = options.flags || {}
    this.ctx = new Context(this as any)
    this.description = options.description
    validateArgDefs(this.args)
  }
  readonly run: (params: RunParams<any[], any>) => any
  readonly ctx: Context
  readonly args: Args
  readonly flags: Flags
  type = 'command' as const
  description?: string
  id?: string
  parent?: Topic

  async exec(argv = process.argv.slice(2)) {
    const ctx = new Context(this)
    try {
      const {args, flags, subcommand} = await parse(this.ctx, argv, this.args, this.flags)
      if (subcommand) {
        const result: any = await subcommand.exec(args)
        return result
      }
      const result: any = await this.run({args: args as any, flags: flags as any, ctx})
      return result
    } catch (err) {
      if (err instanceof VersionSignal || err instanceof HelpSignal) {
        console.log(err.render(ctx))
        return
      }
      throw err
    }
  }

  usage(ctx: Context) {
    const args = this.args.map(a => a.toString({usage: true}))
    return [ctx.subjectPath(this), ...args].join(' ')
  }
}

export interface RunParams<TArgs extends any[], F extends Flags> {
  args: TArgs
  flags: FlagValues<F>
  ctx: Context
}

export function command<F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, R>(options: CommandOptions<[A1, A2], F, [ArgVal<A1>, ArgVal<A2>], R>): Command
export function command<F extends Flags, A1 extends RestArg<any>, R>(options: CommandOptions<[A1], F, ArgVal<A1>[], R>): Command
export function command<F extends Flags, A1 extends Arg<any>, R>(options: CommandOptions<[A1], F, [ArgVal<A1>], R>): Command
export function command<F extends Flags, R>(options: CommandOptions<[], F, [], R>): Command
export function command<F extends Flags, A extends Arg<any>, R>(options: CommandOptions<A[], F, ArgVal<A>[], R>): Command
export function command(opts: CommandOptions): Command {
  return new Command(opts)
}

export type ArgVal<A extends Arg<any>> = A extends {required: false} ? ReturnType<A['parse']> | undefined : ReturnType<A['parse']>
