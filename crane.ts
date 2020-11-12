import * as arg from './lib/arg.ts';

export type RunFn<A, R> = (args: arg.ListToResults<A>) => Promise<R> | R;
export interface Options<A extends arg.List, R> {
  args?: A;
  description?: string;
  run: RunFn<A, R>;
}

export class Command<R> {
  constructor(options: Options<any, R>) {
    this.description = options.description;
    this.args = options.args || [];
    this.run = options.run;
    arg.validate(this.args);
  }
  readonly description?: string;
  readonly args: arg.List;
  private readonly run: RunFn<any, R>;

  async exec(argv = Deno.args): Promise<R> {
    const argResults = await arg.parse(argv, this.args);
    const result = await this.run(argResults as any);
    return result;
  }
}

/**
 * Defines a CLI command
 */
export function command<A extends arg.List, R>(options: Options<A, R>): Command<R> {
  return new Command(options);
}

export {arg}
