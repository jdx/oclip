import { command } from './command';

test('runs a simple command', async () => {
  const result = await command()
    .arg(a => a.name('FOO'))
    .arg(a => a.name('BAR').parse(input => input.trim()))
    .arg(a => a.name('BAZ').parse(input => parseInt(input)))
    .onexec(args => args.map(a => a?.toString().toUpperCase()))
    .exec(['node', 'cmd', 'abc', ' 1 ', '123']);

  expect(result).toEqual(['ABC', '1', '123']);
});

test('has args available on *this*', async () => {
  const args = await command()
    .arg(a => a.name('FOO'))
    .arg(a => a.name('BAR').parse(input => input.trim()))
    .arg(a => a.name('BAZ').parse(input => parseInt(input)))
    .onexec(function () {
      return this.args;
    })
    .exec(['node', 'cmd', 'abc', ' 1 ', '123']);
  expect(args.map(a => a.name)).toEqual(['FOO', 'BAR', 'BAZ']);
});
