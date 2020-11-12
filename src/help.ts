// deno-lint-ignore-file no-explicit-any

import {Command} from './command.ts';

export function commandHelp(command: Command<any, any, any>): string {
  const lines = [];
  if (command.description) lines.push(command.description, '');
  lines.push('Usage: ' + command.usage(), '');
  const argsWithDescription = command.args.filter(
    (a) => !a.hidden && a.description,
  );
  if (argsWithDescription.length) {
    lines.push('Arguments:');
    for (const arg of argsWithDescription) {
      lines.push('  ' + arg.toString().padEnd(17) + ' # ' + arg.description);
    }
    lines.push('');
  }
  // const flags = Object.values(command.flags).filter((f) => !f.hidden);
  // if (flags.length) {
  //   lines.push('Options:');
  //   for (const flag of flags) {
  //     lines.push('  ' + flag.toString().padEnd(17) + ' # ' + flag.description);
  //   }
  //   lines.push('');
  // }
  return lines.join('\n');
}
