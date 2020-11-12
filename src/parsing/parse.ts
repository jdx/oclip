/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { validateArgs, Args } from './args';
import { Flags, Flag } from './flags';
import assert from '../util/assert';
import { RequiredFlagError, InvalidChoiceError } from '../errors/flags';
import { Command } from '../command';
import Context from '../context';
import { VersionSignal, HelpSignal } from '../signals';

interface ParseResult<F extends Flags> {
  args: any[];
  flags: { [K in keyof F]?: any };
  subcommand?: Command;
}

export default async function parse<F extends Flags>(
  ctx: Context,
  argv: string[],
  argDefs: Args,
  flagDefs: F,
): Promise<ParseResult<F>> {
  initFlags(flagDefs);
  argv = argv.slice();
  const args = [] as any;
  type FlagTuple = [Flag<any>, string, string?];
  const flagArgs: FlagTuple[] = [];

  let waitingForFlagValue: undefined | ((arg: string) => void);
  while (argv.length) {
    let arg = argv.shift()!;
    if (waitingForFlagValue) {
      waitingForFlagValue(arg);
      waitingForFlagValue = undefined;
      continue;
    }
    const flag = findFlagMatchingArg(flagDefs, arg);
    if (flag) {
      if (flag.char && arg.startsWith('-' + flag.char) && arg.length > 2) {
        if (flag.type === 'boolean') {
          argv.unshift(`-${arg.slice(2)}`);
        } else {
          argv.unshift(arg.slice(2));
        }
        arg = arg.slice(-2);
      }
      if (arg.includes('=')) {
        const [a, ...rest] = arg.split('=');
        arg = a;
        argv.unshift(rest.join('='));
      }
      if (flag.type === 'input' && flag.name.length + 2 < arg.length) {
        argv.unshift(arg.slice(flag.name.length + 2));
        arg = arg.slice(flag.name.length + 2);
      }
      const tuple: FlagTuple = [flag, arg];
      flagArgs.push(tuple);
      if (flag.type === 'boolean') continue;
      waitingForFlagValue = (arg) => (tuple[2] = arg);
      continue;
    }
    args.push(arg);
  }

  const flags: { [name: string]: any } = {};
  const flagChoices: { [name: string]: string[] } = {};
  const multipleFlags = Object.values(flagDefs).filter((f) => f.multiple);
  for (const flagDef of multipleFlags) {
    flags[flagDef.name] = flagDef.type === 'boolean' ? 0 : [];
  }
  for (const [flag, a, b] of flagArgs) {
    if (flag.type === 'boolean') {
      if (flag.multiple) {
        flags[flag.name]++;
      } else {
        flags[flag.name] = a;
      }
      continue;
    }
    if (flag.choices) {
      if (!(flag.name in flagChoices)) {
        flagChoices[flag.name] = await flag.choices();
      }
      const choices = flagChoices[flag.name];
      assert(b);
      if (!choices.includes(b)) {
        throw new InvalidChoiceError(flag, choices, b);
      }
    }
    if (flag.multiple) {
      flags[flag.name].push(b);
      continue;
    }
    flags[flag.name] = b;
  }

  const missingRequiredFlags = Object.values(flagDefs).filter(
    (flag) =>
      !(flag.name in flags) &&
      flag.required &&
      (flag.type === 'boolean' || !flag.default),
  );
  if (missingRequiredFlags.length) {
    throw new RequiredFlagError({ flags: missingRequiredFlags });
  }

  for (const [name, val] of Object.entries(flags)) {
    const flag = flagDefs[name];
    assert(flag);
    if (flag.type === 'boolean') {
      if (flag.multiple) continue;
      flags[name] = true;
      if (flag.allowNo && val === `--no-${flag.name}`) {
        flags[name] = false;
      }
      continue;
    }
    if (flag.type === 'input' && flag.multiple) {
      for (let i = 0; i < flags[name].length; i++) {
        flags[name][i] = await flag.parse(flags[name][i]);
      }
      continue;
    }
    flags[name] = await flag.parse(val);
  }

  const defsNotAdded = Object.entries(flagDefs).filter(
    ([name]) => !(name in flags),
  );
  for (const [name, def] of defsNotAdded) {
    if (def.type !== 'input' || !def.default) continue;
    flags[name] = await def.default();
  }

  if (args[0] === '--version' || args[0] === '-v') throw new VersionSignal(ctx);
  if (args[0] === '--help' || args[0] === '-v') throw new HelpSignal(ctx);

  const { subcommand } = await validateArgs(ctx, argDefs, args);

  return { args, flags: flags as { [K in keyof F]?: any }, subcommand };
}

function initFlags(flagDefs: Flags) {
  for (const [name, flag] of Object.entries(flagDefs)) {
    flag.name = name;
  }
}

function findFlagMatchingArg(
  flagDefs: Flags,
  arg: string | undefined,
  { partial = false } = {},
): Flag<any> | undefined {
  if (!arg) return;
  if (arg.includes('=')) {
    return findFlagMatchingArg(flagDefs, arg.split('=')[0]);
  }
  for (const flag of Object.values(flagDefs)) {
    if (flag.char && arg.startsWith('-' + flag.char)) return flag;
    if ('--' + flag.name === arg) return flag;
    if (flag.type === 'boolean') {
      if (flag.allowNo && '--no-' + flag.name === arg) return flag;
      continue;
    }
    if (partial && arg.startsWith(`--${flag.name}`)) {
      return flag;
    }
  }
  if (!partial) return findFlagMatchingArg(flagDefs, arg, { partial: true });
}
