import {arg} from './args'
import { command } from './command'
import { topic } from './topic'

const argv = process.argv

describe('run', () => {
  afterEach(() => { process.argv = argv })

  test('runs with just a run function', async () => {
    process.argv = ['node', './script']
    const fn = jest.fn()
    await command({
      run: () => fn('abc')
    }).exec()
    expect(fn).toBeCalledWith('abc')
  })

  test('passes through return value', () => {
    return expect(command({
      run: () => 123
    }).exec([])).resolves.toEqual(123)
  })

  test('gets homedir', () => {
    return command({
      run: ({ctx}) => expect(ctx.dirs.home).toMatch(/^\//)
    }).exec([])
  })
})

describe('subcommands', () => {
  test('runs subcommand', async () => {
    const fn = jest.fn()
    await topic({children: {
      foo: command({
        run: () => fn(),
      })
    }}).exec(['foo'])
    expect(fn).toBeCalledTimes(1)
  })
  test('runs subcommand with arg', async () => {
    const fn = jest.fn()
    await topic({children: {
      foo: command({
        args: [arg('BAR')],
        run: ({args}) => fn(args),
      }),
    }}).exec(['foo', 'bar'])
    expect(fn).toBeCalledWith(['bar'])
  })
})
