import  Context  from '../context'
import { commandHelp, topicHelp } from '../help'
import { Command } from '../command'

export class HelpSignal extends Error {
  constructor(readonly ctx: Context) {
    super('help signal')
  }

  render() {
    if (this.ctx.helpSubject instanceof Command) {
      return commandHelp(this.ctx, this.ctx.helpSubject)
    } else {
      return topicHelp(this.ctx, this.ctx.helpSubject)
    }
  }
}
