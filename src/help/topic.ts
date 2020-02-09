import Context  from '../context'
import { Topic } from '../topic'

export function topicHelp(ctx: Context, topic: Topic) {
  const lines = []
  lines.push('Usage: ' + topic.usage(ctx), '')
  lines.push('Commands:')
  const children = Object.values(topic.children).map(c => c.load())
  const commands = children.filter(c => c.type === 'command')
  if (commands.length === 0) lines.push('  [this topic has no commands]')
  for (const c of commands) {
    let cmd = `  ${c.id}`
    if (c.description) cmd += ` # ${c.description}`
    lines.push(cmd)
  }
  lines.push('')
  return lines.join('\n')
}
