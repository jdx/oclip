import { command } from '.';

test('runs a simple command', async () => {
  const result = await command()
    .arg(a => a)
    .onexec((args) => args)
    .exec(['node', 'cmd', 'abc']);

  expect(result).toEqual(['abc']);
});
