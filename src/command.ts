// deno-lint-ignore-file no-explicit-any

import * as arg from "/arg-old.ts";
import { BoolFlagOpts, Flags } from "/flag.ts";

/**
 * @callback CommandRunFn
 * @param {any}   - the parsed positional arguments. Usually these will be strings but can
 * be parsed into other types.
 * @param {Flags} - a key-value object for flag values
 * @returns {Promise<any>} - the command can return anything and it will propagate down to the caller. It
 * will always run async.
 */
export type CommandRunFn<A extends arg.List, F extends Flags, R> = (
  args: arg.ListToResults<A>,
) => Promise<R> | R;
export interface CommandOptions<A extends arg.List, F extends Flags, R> {
  args?: A;
  flags?: F;
  description?: string;
  hidden?: boolean;
  main?: boolean;
  run: CommandRunFn<A, F, R>;
}

export class Command<A extends arg.List, F extends Flags, R> {
  constructor(options: CommandOptions<A, F, R>) {
    this.description = options.description;
    this.args = options.args || [];
    this.hidden = !!options.hidden;
    this._run = options.run;
    arg.validate(this.args);
  }
  readonly description?: string;
  readonly args: arg.List;
  readonly hidden: boolean;
  private readonly _run: CommandRunFn<A, F, R>;

  async run(argv = Deno.args): Promise<R> {
    const argResults = await arg.parse(argv, this.args);
    const result = await this._run(argResults as any);
    return result;
  }

  usage(): string {
    return "USAGE";
  }
}

/**
 * Defines a CLI command
 *
 * @param {Object} options
 * @param {Boolean} options.main - pass true to start the command immediately.
 * You can pass import.meta.main in which is true when the script is being run directly.
 * This allows us to have a command be imported for tests but also run directly without a wrapper.
 * @param {CommandRunFn} options.run - Called when the command is run with parsed args + flags.
 */
export function command<A extends arg.List, F extends Flags, R>(
  options: CommandOptions<A, F, R>,
): Command<A, F, R> {
  const cmd = new Command(options);
  if (options.main) {
    cmd.run(Deno.args)
      .catch((err) => {
        console.error(err);
        console.error(err.message);
        Deno.exit(1);
      });
  }
  return cmd;
}

interface ArgOptions<T> {
  name: string
  required?: boolean
  rest?: boolean
  parse?: (input: string) => T
}
abstract class ArgBase<T> {
  constructor(opts: ArgOptions<T>) {
  }
}
class RequiredArg<T> extends ArgBase<T> {
  value!: T
}
class OptionalArg<T> extends ArgBase<T> {
  value?: T
}
class RestArg<T> extends ArgBase<T> {
  value: T[] = []
}
type Arg<T> = RequiredArg<T> | OptionalArg<T> | RestArg<T>
type ArgDataTypeFromOptions<AO extends ArgOptions<unknown>> =
  AO['parse'] extends (input: string) => infer T
  ? T : string;

type ArgOptsToType<AO extends ArgOptions<unknown>>
 = AO['rest'] extends true ? RestArg<ArgDataTypeFromOptions<AO>>
 : AO['required'] extends true ? RequiredArg<ArgDataTypeFromOptions<AO>>
 : OptionalArg<ArgDataTypeFromOptions<AO>>;

class CMD<AL extends readonly Arg<unknown>[]> {
  static init(): CMD<[]> {
    return new CMD([]);
  }

  constructor(private readonly args: AL) {}

  arg<AO extends ArgOptions<unknown>>(opts: AO): CMD<[...AL, ArgOptsToType<AO>]> {
    let arg: Arg<unknown>;
    if (opts.rest) arg = new RestArg(opts);
    else if (opts.required) arg = new RequiredArg(opts);
    else arg = new OptionalArg(opts);
    return new CMD([...this.args, arg as any]);
  }
}

const cmd = CMD.init()
  .arg({name: 'foo1', parse: () => 1})
  .arg({name: 'foo2', required: true})
  .arg({name: 'foo3'})
  .arg({name: 'foo4'});
console.log(cmd);
