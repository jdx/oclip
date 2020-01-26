import { command } from './command'
import { arg } from './args'
import { flag } from '.'

test('help signal', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
  await command({
    args: [arg('required_arg'), arg.optional('optional_arg'), arg.rest('rest_arg')],
    flags: {
      foo: flag.boolean({description: 'a boolean flag'}),
      bar: flag.input({description: 'an input flag'}),
    },
    run: () => {}
  }).exec(['--help'])
  expect(spy).toHaveBeenCalledWith('oclip version:')
})
