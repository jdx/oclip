import { OclipError } from './oclip';
import type { Arg } from '../parsing/args';

export class RequiredArgsError extends OclipError {
  public args: Arg<any>[];

  constructor({ args }: { args: Arg<any>[] }) {
    let message = `Missing ${args.length} required arg${
      args.length === 1 ? '' : 's'
    }`;
    const namedArgs = args.filter((a) => a.name);
    if (namedArgs.length > 0) {
      // const list = m.list.renderList(namedArgs.map(a => [a.name, a.description] as [string, string]))
      const list = namedArgs.map((a) => [a.name, a.description]);
      message += `:\n${list}`;
    }
    message += '\nSee more help with --help';
    super({ message });
    this.args = args;
  }
}

export class UnexpectedArgsError extends OclipError {
  public args: string[];

  constructor({ args }: { args: string[] }) {
    let message = `Unexpected argument${
      args.length === 1 ? '' : 's'
    }: ${args.join(', ')}`;
    message += '\nSee more help with --help';
    super({ message });
    this.args = args;
  }
}
