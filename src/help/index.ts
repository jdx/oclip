import Context  from '../context'
import { Command } from '../command'
import { Topic } from '../topic'

export function commandHelp(ctx: Context, command: Command) {
  const lines = []
  if (command.description) lines.push(command.description, '')
  lines.push('Usage: ' + command.usage(ctx), '')
  const argsWithDescription = command.args.filter(a => !a.hidden && a.description)
  if (argsWithDescription.length) {
    lines.push('Arguments:')
    for (let arg of argsWithDescription) {
      lines.push('  ' + arg.toString().padEnd(17) + ' # ' + arg.description)
    }
    lines.push('')
  }
  const flags = Object.values(command.flags).filter(f => !f.hidden)
  if (flags.length) {
    lines.push('Options:')
    for (let flag of flags) {
      lines.push('  ' + flag.toString().padEnd(17) + ' # ' + flag.description)
    }
    lines.push('')
  }
  return lines.join('\n')
}

export function topicHelp(ctx: Context, topic: Topic) {
  const lines = []
  lines.push('Usage: ' + topic.usage(ctx), '')
  lines.push('Commands:')
  for (const [k, child] of Object.entries(topic.children)) {
    const c = child.load()
    let cmd = `  ${k}`
    if (c.description) cmd += ` # ${c.description}`
    lines.push(cmd)
  }
  lines.push('')
  return lines.join('\n')
}
