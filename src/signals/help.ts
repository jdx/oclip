import  Context  from '../context'
import { commandHelp, topicHelp } from '../help'
import { Command } from '../command'
import { Signal } from './signal'

export class HelpSignal extends Signal {
  constructor(readonly ctx: Context) { super(ctx, 'help') }
  code = 191
  render(): string {
    if (this.ctx.subject instanceof Command) {
      return commandHelp(this.ctx, this.ctx.subject)
    } else {
      return topicHelp(this.ctx, this.ctx.subject)
    }
  }
}
