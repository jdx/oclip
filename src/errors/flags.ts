import { OclipError } from './oclip';
import type { Flag } from '../parsing/flags';

export class RequiredFlagError extends OclipError {
  public flags: Flag<any>[];

  constructor({ flags }: { flags: Flag<any>[] }) {
    // const usage = m.list.renderList(m.help.flagUsages([flag], {displayRequired: false}))
    // const message = `Missing required flag:\n${usage}`
    let message = `Missing required flag${
      flags.length > 1 ? 's' : ''
    }: ${flags.map((f) => f.toString()).join('\n')}`;
    message += '\nSee more help with --help';
    super({ message });
    this.flags = flags;
  }
}

export class InvalidChoiceError extends OclipError {
  flag: Flag<any>;
  choices: string[];
  arg: string;
  constructor(flag: Flag<any>, choices: string[], arg: string) {
    const choiceOutput = choices.slice(-100);
    if (choiceOutput.length === 100) choiceOutput.push('...');
    let message = `Expected ${arg} to be one of: ${choiceOutput.join(', ')}`;
    message += '\nSee more help with --help';
    super({ message });
    this.flag = flag;
    this.choices = choices;
    this.arg = arg;
  }
}
