import { validateArgDefs, Args, Arg, RestArg } from './args'
import parse from './parse'
import { VersionSignal } from './version'
import { Context } from './context'
import { Flags, FlagValues } from './flags'
import { BaseOptions, Topic } from './topic'
import { HelpSignal } from './help'
import path = require('path')

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
  description?: string
  id?: string
  parent?: Topic

  async exec(argv = process.argv.slice(2)) {
    try {
      const {args, flags, subcommand} = await parse(this.ctx, argv, this.args, this.flags)
      const ctx = new Context(this)
      if (subcommand) {
        const result: any = await subcommand.exec(args)
        return result
      }
      const result: any = await this.run({args: args as any, flags: flags as any, ctx})
      return result
    } catch (err) {
      if (err instanceof VersionSignal || err instanceof HelpSignal) {
        console.log(err.render())
        return
      }
      throw err
    }
  }

  usage() {
    const args = this.args.map(a => a.toString({usage: true}))
    return [this.commandPath(this), ...args].join(' ')
  }

  private commandPath(subject: Command | Topic | undefined) {
    const p = []
    while (subject?.id) {
      p.unshift(subject.id)
      subject = subject.parent
    }
    p.unshift(path.basename(process.argv[1]))
    p.unshift(path.basename(process.argv[0]))
    return p.join(' ')
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
