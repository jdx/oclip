// deno-lint-ignore-file no-explicit-any

import * as arg from "./arg.ts";
import {Flags} from './flag.ts';

export type CommandRunFn<A extends arg.List, F extends Flags, R> = (args: arg.ListToResults<A>) => Promise<R> | R;
export interface CommandOptions<A extends arg.List, F extends Flags, R> {
  args?: A;
  flags?: F;
  description?: string;
  run: CommandRunFn<A, F, R>;
}

export class Command<A extends arg.List, F extends Flags, R> {
  constructor(options: CommandOptions<A, F, R>) {
    this.description = options.description;
    this.args = options.args || [];
    this.run = options.run;
    arg.validate(this.args);
  }
  readonly description?: string;
  readonly args: arg.List;
  private readonly run: CommandRunFn<A, F, R>;

  async exec(argv = Deno.args): Promise<R> {
    const argResults = await arg.parse(argv, this.args);
    const result = await this.run(argResults as any);
    return result;
  }
}

/**
 * Defines a CLI command
 */
export function command<A extends arg.List, F extends Flags, R>(
  options: CommandOptions<A, F, R>,
): Command<A, F, R> {
  return new Command(options);
}
