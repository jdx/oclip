import { Command, FullOptions } from './command'
import { validateArgs, Arg } from './args'

interface ParseResult {
  args: any[]
  flags: {}
  subcommand?: Command<any, any>
}

export default async function parse<A extends Arg<any>[]>(options: FullOptions<A, any, any, any>, argv: string[]): Promise<ParseResult> {
  argv = argv.slice()
  const args = [] as any
  const flags = {}

  while(argv.length) {
    const arg = argv.shift()
    args.push(arg)
  }

  const {subcommand} = await validateArgs(options, args)

  return {args, flags, subcommand}
}
