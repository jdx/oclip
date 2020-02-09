import { command } from '../command'
import { arg } from '../parsing/args'
import { flag, } from '..'
import Context from '../context'
import { commandHelp, } from './command'
import path = require('path')

const proc = path.basename(process.argv[1])

test('help signal', async () => {
  await expect(command({
    args: [arg('required_arg'), arg.optional('optional_arg'), arg.rest('rest_arg')],
    flags: {
      foo: flag.boolean({description: 'a boolean flag'}),
      bar: flag.input({description: 'an input flag'}),
    },
    run: () => {}
  }).exec(['--help']))
    .rejects.toThrowError('help signal')
})

test('renders arg description', () => {
  const cmd = command({
    args: [arg('arg-name', 'description')],
    run: () => {}
  })
  const ctx = new Context(cmd)
  expect(commandHelp(ctx, cmd)).toEqual(`Usage: ${proc} <ARG-NAME>

Arguments:
  ARG-NAME          # description
`)})
test('renders flag description', () => {
  const cmd = command({
    flags: {foo: flag.input('a', 'description')},
    run: () => {}
  })
  const ctx = new Context(cmd)
  expect(commandHelp(ctx, cmd)).toEqual(`Usage: ${proc}

Options:
  -a                # description
`)})
