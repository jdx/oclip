import { Flags } from '../parsing/flags'
import { Args } from '../parsing/args'
import { CommandOptions, Command } from '../command'
import { HelpSignal, VersionSignal } from '../signals'
import Context from '../context'
import assert from '../util/assert'

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
  getChild?: (id: string) => (Topic | Command | undefined)
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
      this.children[id] = {
        load: () => {
          if (typeof c === 'string') c = require(c).default
          assert(typeof c === 'object')
          c.id = id
          c.parent = this
          return c
        },
        id,
        parent: this,
      }
    }
  }

  getChild(id: string): Topic | Command | undefined {
    if (!id) return
    if (id in this.children) {
      return this.children[id].load()
    }
    if (!this.options.getChild) return
    return this.options.getChild(id)
  }

  readonly args: Args
  readonly flags: Flags
  readonly description?: string
  readonly children: {[id: string]: Child} = {}
  type = 'topic' as const
  id?: string
  parent?: Topic

  async exec(argv = process.argv.slice(2)): Promise<any> {
    const ctx = new Context(this)
    argv.slice()
    const cmd = argv.shift()
    if (cmd === '-v' || cmd === '--version') throw new VersionSignal(ctx)
    const c = this.getChild(cmd!)
    if (!c || cmd === '-h' || cmd === '--help') throw new HelpSignal(ctx)
    return c.exec(argv)
  }

  usage(ctx: Context) {
    const args = this.args.map(a => a.toString({usage: true}))
    return [ctx.subjectPath(), ...args].join(' ')
  }
}

export function topic(options: TopicOptions): Topic {
  return new Topic(options)
}
