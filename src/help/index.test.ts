import { command } from '../command'
import { arg } from '../parsing/args'
import { flag, topic } from '..'
import Context from '../context'
import { commandHelp, topicHelp } from '.'
import path = require('path')

const proc = path.basename(process.argv[1])

describe('command', () => {
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
    expect(spy).toHaveBeenCalledWith(`Usage: node ${proc} <REQUIRED_ARG> [<OPTIONAL_ARG>] [<REST_ARG>]

Options:
  --foo             # a boolean flag
  --bar             # an input flag
`)
  })

  test('renders arg description', () => {
    const cmd = command({
      args: [arg('arg-name', 'description')],
      run: () => {}
    })
    const ctx = new Context(cmd)
    expect(commandHelp(ctx, cmd)).toEqual(`Usage: node ${proc} <ARG-NAME>

Arguments:
  ARG-NAME          # description
`)})
  test('renders flag description', () => {
    const cmd = command({
      flags: {foo: flag.input('a', 'description')},
      run: () => {}
    })
    const ctx = new Context(cmd)
    expect(commandHelp(ctx, cmd)).toEqual(`Usage: node ${proc}

Options:
  -a                # description
`)})
})

describe('topic', () => {
  test('help signal', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
    await topic({
      children: {
        foo: command({run() {}})
      }
    }).exec([])
    expect(spy).toHaveBeenCalledWith(`Usage: node ${proc}

Commands:
  foo
`)
  })

  test('renders commands', () => {
    const t = topic({
      children: {
        foo: command({
          run: () => {},
        })
      }
    })
    const ctx = new Context(t)
    expect(topicHelp(ctx, t)).toEqual(`Usage: node ${proc}

Commands:
  foo
`)})
  test('renders commands lazily', () => {
    const t = topic({
      children: {
        foo: path.join(__dirname, '../../test/fixtures/command.js')
      }
    })
    const ctx = new Context(t)
    expect(topicHelp(ctx, t)).toEqual(`Usage: node ${proc}

Commands:
  foo # sample command
`)})
})
