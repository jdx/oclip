import { Arg, ArgList, ArgBuilder, ArgValues, OptionalArg } from './arg';
import { UnexpectedArgumentException } from './errors';
import { FlagBuilder, FlagDef, FlagDict, FlagValues } from './flags';

export type ExecFnThis<ArgDefs extends ArgList> = { args: ArgDefs };
export type ExecFn<ArgDefs extends ArgList, FlagDefs extends FlagDict, R> = (
  this: ExecFnThis<ArgDefs>,
  args: ArgValues<ArgDefs>,
  flags: FlagValues<FlagDefs>
) => R;

export interface Command<ArgDefs extends ArgList, FlagDefs extends FlagDict, R> {
  args: ArgDefs;
  flags: FlagDefs;
  onexec: ExecFn<ArgDefs, FlagDefs, R>;
}

export type ArgBuilderFn<A extends Arg> = (ab: ArgBuilder<OptionalArg<string>>) => ArgBuilder<A>;
export type FlagBuilderFn<K extends string, F extends FlagDef<K>> = (
  fb: FlagBuilder<FlagDef<K, string>>
) => FlagBuilder<F>;

export class CommandBuilder<ArgDefs extends ArgList, FlagDefs extends FlagDict, R> {
  constructor(private readonly value: Command<ArgDefs, FlagDefs, R>) {}

  arg<A extends Arg>(build: ArgBuilderFn<A>): CommandBuilder<[...ArgDefs, A], FlagDefs, R> {
    const arg = build(ArgBuilder.init()).value;

    return new CommandBuilder({
      ...this.value,
      args: [...this.value.args, arg] as any,
    });
  }

  flag<K extends string, F extends FlagDef<K>>(
    name: K,
    build: FlagBuilderFn<K, F>
  ): CommandBuilder<ArgDefs, FlagDefs & { [P in K]: F }, R> {
    const flag = build(FlagBuilder.init(name)).value;

    return new CommandBuilder({
      ...this.value,
      flags: {
        ...this.value.flags,
        [flag.name]: flag,
      },
    });
  }

  onexec<R>(onexec: ExecFn<ArgDefs, FlagDefs, R>): CommandBuilder<ArgDefs, FlagDefs, R> {
    return new CommandBuilder({
      ...this.value,
      onexec,
    });
  }

  async exec(argv = process.argv): Promise<R> {
    const cmd = this.value;

    argv = argv.slice(2);

    const args = [];
    const flags = {} as any;
    const argDefs = cmd.args.slice();
    let parsingFlags = true;
    for (const raw of argv) {
      if (raw === '--') {
        parsingFlags = false;
        continue;
      }
      if (parsingFlags && raw.startsWith('--')) {
        const name = raw.slice(2);
        if (name in cmd.flags) {
          flags[name] = true;
          continue;
        }
      }

      const argDef = argDefs.shift();
      if (!argDef) throw new UnexpectedArgumentException(raw);
      args.push(argDef.parse(raw));
    }

    return await cmd.onexec(args as any, flags);
  }
}

export function command(): CommandBuilder<[], FlagDict, void> {
  return new CommandBuilder({ args: [], flags: {}, onexec: () => {} });
}
