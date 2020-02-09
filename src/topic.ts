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
  children: {[id: string]: Topic | Command | string}
}

export interface Child {
  load(): Topic | Command
  id: string
  parent: Topic
}

export class Topic {
  constructor(readonly options: TopicOptions) {
    this.description = options.description
    this.args = options.args || []
    this.flags = options.flags
    for (let [id, c] of Object.entries(options.children)) {
      const load = typeof c === 'string'
        ? (() => require(c as string).default)
        : (() => c)
      this.children[id] = {
        load,
        id,
        parent: this,
      }
    }
  }

  readonly args: Args
  readonly flags: Flags
  readonly description?: string
  readonly children: {[id: string]: Child} = {}
  type = 'topic' as const
  id?: string
  parent?: Topic

  exec(argv = process.argv.slice(2)): any {
    try {
      //console.log(argv)
      argv.slice()
      const cmd = argv.shift()
      if (cmd && cmd in this.children) {
        const c = this.children[cmd].load()
        return c.exec(argv)
      } else {
        const ctx = new Context(this)
        throw new HelpSignal(ctx)
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
