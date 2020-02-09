import { Flags } from './flags'
import { Args } from './args'
import { CommandOptions, Command } from './command'
import { HelpSignal } from './help'
import { Context } from './context'
import { VersionSignal } from './version'
import * as path from 'path'

export type Options<A extends Args = any[], F extends Flags = any, R=any, TArgs extends any[] = any[]> =
  | CommandOptions<A, F, TArgs, R>
  | TopicOptions

export interface BaseOptions<A extends Args = any[], F extends Flags = any> {
  args?: A
  flags?: F
  description?: string
}

export interface TopicOptions extends BaseOptions {
  children: {[id: string]: Topic | Command}
}

export class Topic {
  constructor(readonly options: TopicOptions) {
    this.args = options.args || []
    this.flags = options.flags
    this.children = options.children
    for (let [id, c] of Object.entries(this.children)) {
      c.id = id
      c.parent = this
    }
  }

  readonly args: Args
  readonly flags: Flags
  readonly children: {[id: string]: Topic | Command}
  type = 'topic' as const
  id?: string
  parent?: Topic

  exec(argv = process.argv.slice(2)): any {
    try {
      //console.log(argv)
      argv.slice()
      const cmd = argv.shift()
      if (cmd) {
        if (cmd in this.children) {
          return this.children[cmd].exec(argv)
        } else {
          const ctx = new Context(this)
          throw new HelpSignal(ctx)
        }
      }
    } catch (err) {
      if (err instanceof VersionSignal || err instanceof HelpSignal) {
        console.log(err.render())
        return
      }
      console.error(err.stack || err)
      process.exit(191)
    }
  }

  usage() {
    const args = this.args.map(a => a.toString({usage: true}))
    return [this.topicPath(this), ...args].join(' ')
  }

  private topicPath(subject: Command | Topic | undefined) {
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

export function topic(options: TopicOptions): Topic {
  return new Topic(options)
}
