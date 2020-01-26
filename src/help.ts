import { Context } from './context'
import { Command } from './command'
import { Topic } from './topic'
import * as path from 'path'

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

function commandHelp(ctx: Context, command: Command) {
  console.log(ctx)
  console.log(command)
  const lines = []
  if (command.description) lines.push(command.description, '')
  lines.push('Usage: ' + command.usage(), '')
  if (command.args.length) {
    lines.push('Arguments:')
    for (let arg of command.args) {
      lines.push('    ' + arg.toString().padStart(4))
    }
    lines.push()
  }
  return lines.join('\n')
}

function topicHelp(ctx: Context, topic: Topic) {
  console.log(ctx)
  console.log(topic)
  return 'fooo'
}
