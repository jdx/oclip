import { Context } from './context'
import { Command } from './command'
import { Topic } from './topic'

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
  const lines = []
  if (command.description) lines.push(command.description, '')
  lines.push('Usage: ' + command.usage(), '')
  const argsWithDescription = command.args.filter(a => !a.hidden && a.description)
  if (argsWithDescription.length) {
    lines.push('Arguments:')
    for (let arg of argsWithDescription) {
      lines.push('  ' + arg.toString().padStart(4))
    }
    lines.push()
  }
  const flags = Object.values(command.flags).filter(f => !f.hidden)
  if (flags) {
    lines.push('Options:')
    for (let flag of flags) {
      lines.push('  ' + flag.toString({description: true}).padStart(4))
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
