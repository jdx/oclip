import Context  from '../context'
import { Topic } from '../topic'

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
