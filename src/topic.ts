import { Flags } from './flags'
import { Args } from './args'
import { CommandOptions, Command } from './command'

export type Options<A extends Args = any[], F extends Flags = any, R=any, TArgs extends any[] = any[]> =
  | CommandOptions<A, F, TArgs, R>
  | TopicOptions

export interface BaseOptions<A extends Args = any[], F extends Flags = any> {
  args?: A
  flags?: F
}

export interface TopicOptions extends BaseOptions {
  children: {[id: string]: Topic | Command}
}

export class Topic {
  constructor(readonly options: TopicOptions) {
    this.args = options.args || []
    this.flags = options.flags
    this.children = options.children
  }

  readonly args: Args
  readonly flags: Flags
  readonly children: {[id: string]: Topic | Command}

  exec(argv = process.argv.slice(2)): any {
    console.log(argv)
    argv.slice()
    const cmd = argv.shift()
    if (cmd) return this.children[cmd].exec(argv)
  }
}
