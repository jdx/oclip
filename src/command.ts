import {arg, Arg, OptionalArg, ArgValues} from './arg';

export interface CommandOpts<DArgs extends readonly any[], DFlags> {
  args: DArgs,
  flags: DFlags,
}

export type ExecFn<Args extends readonly Arg<any>[]> = (args: ArgValues<Args>) => void

export class Command<Args extends readonly any[], DFlags> {
  constructor(private opts: CommandOpts<Args, DFlags>) { }

  private _onexec: ExecFn<Args> = () => { }

  arg<T>(builder: (arg: OptionalArg<string>) => Arg<T>): Command<[...Args, Arg<T>], DFlags> {
    return new Command({
      ...this.opts,
      args: [
        ...this.opts.args,
        builder(arg()),
      ]
    });
  }

  onexec(exec: ExecFn<Args>): this {
    this._onexec = exec;
    return this;
  }
}

export function command(): Command<[], unknown> {
  return new Command({ args: [], flags: {} });
}

command()
  .arg(a => a)
  .arg(a => a.parse(input => 100))
  .onexec(args => {
    console.log(args);
  })
