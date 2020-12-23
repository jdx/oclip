import { Command } from './command';
import { UnexpectedArgumentException } from './errors';

export async function parse(
  cmd: Command<any, any, any>,
  argv: string[]
): Promise<{ args: any[]; flags: any }> {
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

  return { args, flags };
}
