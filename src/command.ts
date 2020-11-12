// deno-lint-ignore-file no-explicit-any

import * as arg from "./arg.ts";

export type CommandRunFn<A, R> = (args: arg.ListToResults<A>) => Promise<R> | R;
export interface CommandOptions<A extends arg.List, R> {
  args?: A;
  description?: string;
  run: CommandRunFn<A, R>;
}

export class Command<R> {
  constructor(options: CommandOptions<any, R>) {
    this.description = options.description;
    this.args = options.args || [];
    this.run = options.run;
    arg.validate(this.args);
  }
  readonly description?: string;
  readonly args: arg.List;
  private readonly run: CommandRunFn<any, R>;

  async exec(argv = Deno.args): Promise<R> {
    const argResults = await arg.parse(argv, this.args);
    const result = await this.run(argResults as any);
    return result;
  }
}

/**
 * Defines a CLI command
 */
export function command<A extends arg.List, R>(
  options: CommandOptions<A, R>,
): Command<R> {
  return new Command(options);
}
