import { command } from '../command';
import { topic } from '..';
import Context from '../context';
import { topicHelp } from './topic';
import path = require('path');

const proc = path.basename(process.argv[1]);

test('help signal', () => {
  return expect(
    topic({
      children: {
        foo: command({ run() {} }),
      },
    }).exec([]),
  ).rejects.toThrow('help signal');
});

test('renders commands', () => {
  const t = topic({
    children: {
      foo: command({
        run: () => {},
      }),
    },
  });
  const ctx = new Context(t);
  expect(topicHelp(ctx, t)).toEqual(`Usage: ${proc}

Commands:
  foo
`);
});

test('renders commands lazily', () => {
  const t = topic({
    children: {
      foo: path.join(__dirname, '../../test/fixtures/command.js'),
    },
  });
  const ctx = new Context(t);
  expect(topicHelp(ctx, t)).toEqual(`Usage: ${proc}

Commands:
  foo # sample command
`);
});

test('getChild', () => {
  const t = topic({
    children: {
      foo: command({ description: '1', run() {} }),
    },
    getChild(name) {
      if (name === 'bar') return command({ description: '2', run() {} });
    },
  });
  expect(t.getChild('foo')).toMatchObject({ description: '1' });
  expect(t.getChild('bar')).toMatchObject({ description: '2' });

  const ctx = new Context(t);
  expect(topicHelp(ctx, t)).toEqual(`Usage: ${proc}

Commands:
  foo # 1
`);
});
