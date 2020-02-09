import { validateArgs, Args } from './args'
import { Flags, Flag } from './flags'
import assert from '../util/assert'
import { RequiredFlagError } from '../errors/flags'
import { Command } from '../command'
import  Context  from '../context'
import { VersionSignal, HelpSignal } from '../signals'

interface ParseResult<F extends Flags> {
  args: any[]
  flags: {[K in keyof F]?: any}
  subcommand?: Command
}

export default async function parse<F extends Flags>(ctx: Context, argv: string[], argDefs: Args, flagDefs: F): Promise<ParseResult<F>> {
  initFlags(flagDefs)
  argv = argv.slice()
  const args = [] as any
  type FlagTuple = [Flag<any>, string, string?]
  const flagArgs: FlagTuple[] = []

  let waitingForFlagValue: undefined | ((arg: string) => void)
  while(argv.length) {
    let arg = argv.shift()!
    if (waitingForFlagValue) {
      waitingForFlagValue(arg)
      waitingForFlagValue = undefined
      continue
    }
    const flag = findFlagMatchingArg(flagDefs, arg)
    if (flag) {
      if (arg.includes('=')) {
        let [a, ...rest] = arg.split('=')
        arg = a
        argv.unshift(rest.join('='))
      }
      if (flag.type === 'input' && flag.name.length+2 < arg.length) {
        argv.unshift(arg.slice(flag.name.length+2))
        arg = arg.slice(flag.name.length+2)
      }
      const tuple: FlagTuple = [flag, arg]
      flagArgs.push(tuple)
      if (flag.type === 'boolean') continue
      waitingForFlagValue = arg => tuple[2] = arg
      continue
    }
    args.push(arg)
  }

  const flags: {[name: string]: any} = {}
  for (const [flag, a, b] of flagArgs) {
    if (flag.type === 'boolean') {
      flags[flag.name] = a
      continue
    }
    if (flag.multiple) {
      flags[flag.name] = (flags[flag.name] || [])
      flags[flag.name].push(b)
      continue
    }
    flags[flag.name] = b
  }

  const missingRequiredFlags = Object.values(flagDefs)
    .filter(flag => !(flag.name in flags) && flag.required && !flag.default)
  if (missingRequiredFlags.length) {
    throw new RequiredFlagError({flags: missingRequiredFlags})
  }

  for (const [name, val] of Object.entries(flags)) {
    const flag = flagDefs[name]
    assert(flag)
    if (flag.type === 'input' && flag.multiple) {
      for (let i=0; i<flags[name].length; i++) {
        flags[name][i] = await flag.parse(flags[name][i])
      }
      continue
    }
    flags[name] = await flag.parse(val)
  }

  const defsNotAdded = Object.entries(flagDefs).filter(([name]) => !(name in flags))
  for (const [name, def] of defsNotAdded) {
    flags[name] = typeof def.default === 'function' ? (await def.default()) : def.default
  }

  if (args[0] === '--version' || args[0] === '-v') throw new VersionSignal()
  if (args[0] === '--help' || args[0] === '-v') throw new HelpSignal(ctx)

  const {subcommand} = await validateArgs(ctx, argDefs, args)

  return {args, flags: flags as {[K in keyof F]?: any}, subcommand}
}

function initFlags(flagDefs: Flags) {
  for (const [name, flag] of Object.entries(flagDefs)) {
    flag.name = name
  }
}

function findFlagMatchingArg(flagDefs: Flags, arg: string | undefined, {partial = false} = {}): Flag<any> | undefined {
  if (!arg) return
  if (arg.includes('=')) {
    return findFlagMatchingArg(flagDefs, arg.split('=')[0])
  }
  for (const flag of Object.values(flagDefs)) {
    if (flag.char && ('-' + flag.char) === arg) return flag
    if ('--' + flag.name === arg) return flag
    if (flag.type === 'boolean') {
      if (flag.allowNo && '--no-' + flag.name === arg) return flag
      continue
    }
    if (partial && arg.startsWith(`--${flag.name}`)) {
      return flag
    }
  }
  if (!partial) return findFlagMatchingArg(flagDefs, arg, {partial: true})
}
