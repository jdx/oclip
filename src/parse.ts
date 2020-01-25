import { Arg, parseArgs } from './args'
import { UnexpectedArgsError, RequiredArgsError } from './errors'
import { Options, Command } from './command'
import { VersionSignal } from './signals'

interface ParseResult {
  args: any[]
  flags: {}
  subcommand?: Command<any, any>
}

const numOptionalArgs = (args: Arg<any>[]) => args.reduce((total, arg) => arg.rest ? -1 : total + 1, 0)

export default async function parse(options: Options<any, any, any, any>, argv: string[]): Promise<ParseResult> {
  argv = argv.slice()
  const argDefs: Arg<any>[] = options.args
  let requiredArgs = argDefs.filter(a => a.required)
  let maxArgs = numOptionalArgs(argDefs)
  const args = [] as any
  const flags = {}
  let subcommand: Command<any, any> | undefined

  while(argv.length) {
    const arg = argv.shift()
    args.push(arg)
  }

  if (args[0]) {
    if (args[0] === '--version' || args[0] === '-v') throw new VersionSignal()
    if (options.subcommands) {
      subcommand = options.subcommands[args[0]]
      if (subcommand) {
        maxArgs = -1
        args.shift()
      }
    }
  }

  const parsedArgs = await parseArgs(args, argDefs)

  const missingRequiredArgs = requiredArgs.slice(args.length)
  if (missingRequiredArgs.length) {
    throw new RequiredArgsError({args: missingRequiredArgs})
  }

  if (maxArgs !== -1 && args.length > maxArgs) {
    throw new UnexpectedArgsError({args: args.slice(maxArgs)})
  }

  return {args: parsedArgs, flags, subcommand}
}
