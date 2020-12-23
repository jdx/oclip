import { Arg, ArgList, ArgBuilder, ArgValues, OptionalArg} from './arg';
import { UnexpectedArgumentException } from './errors';

export type ExecFn<ArgDefs extends ArgList, R> = (args: ArgValues<ArgDefs>) => R

export interface Command<ArgDefs extends ArgList, Flags, R> {
  args: ArgDefs
  flags: Flags
  onexec: ExecFn<ArgDefs, R>
}

export type ArgBuilderFn<A extends Arg> = (ab: ArgBuilder<OptionalArg<string>>) => ArgBuilder<A>

export class CommandBuilder<ArgDefs extends ArgList, Flags, R> {
  constructor(private readonly value: Command<ArgDefs, Flags, R>) { }

  arg<A extends Arg>(build: ArgBuilderFn<A>): CommandBuilder<[...ArgDefs, A], Flags, R> {
    const arg = build(ArgBuilder.init()).value;

    return new CommandBuilder({
      ...this.value,
      args: [...this.value.args, arg] as any
    });
  }

  onexec<R>(onexec: ExecFn<ArgDefs, R>): CommandBuilder<ArgDefs, Flags, R> {
    return new CommandBuilder({
      ...this.value,
      onexec,
    })
  }

  async exec(argv = process.argv): Promise<R> {
    const cmd = this.value;

    argv = argv.slice(2);

    const args = [];
    const argDefs = cmd.args.slice();
    for (const raw of argv) {
      const argDef = argDefs.shift();
      if (!argDef) throw new UnexpectedArgumentException(raw);
      args.push(argDef.parse(raw));
    }

    return await cmd.onexec(args as any);
  }
}

export function command(): CommandBuilder<[], any, void> {
  return new CommandBuilder({ args: [], flags: {}, onexec: () => {}});
}
