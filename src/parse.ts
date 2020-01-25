import type { Options } from './options'
import type { Arg } from './args'
import { UnexpectedArgsError, RequiredArgsError } from './errors'

interface ParseResult {
  args: any[]
  flags: {}
}

const numRequiredArgs = (args: Arg<any>[]) => args.reduce((total, arg) => arg.required ? total + 1 : total, 0)
const numOptionalArgs = (args: Arg<any>[]) => args.reduce((total, arg) => arg.rest ? -1 : total + 1, 0)

export default async function parse(options: Options<any, any>, argv: string[]): Promise<ParseResult> {
  argv = argv.slice()
  const argDefs = options.args || []
  const minArgs = numRequiredArgs(argDefs)
  const maxArgs = numOptionalArgs(argDefs)
  const args = [] as any
  const flags = {}

  while(argv.length) {
    const arg = argv.shift()
    args.push(arg)
  }

  if (args.length < minArgs) {
    throw new RequiredArgsError({args: argDefs.slice(args.length)})
  }

  if (maxArgs !== -1 && args.length > maxArgs) {
    throw new UnexpectedArgsError({args: args.slice(maxArgs)})
  }

  return {args, flags}
}
