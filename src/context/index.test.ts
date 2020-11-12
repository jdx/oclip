import Context from '.';
import { topic } from '../topic';
import { command } from '../command';
import path = require('path');

const proc = path.basename(process.argv[1]);

const bar = command({ run() {} });
const foo = topic({ children: { bar } });
const t = topic({ children: { foo } });

describe('subjectPath', () => {
  test('renders', () => {
    t.children.foo.load();
    foo.children.bar.load();
    const ctx = new Context(bar);
    expect(ctx.subjectPath()).toEqual(`${proc} foo bar`);
  });
});
