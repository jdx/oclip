import {oclip, arg} from '.'

const argv = process.argv

describe('run', () => {
  afterEach(() => { process.argv = argv })

  test('runs with just a run function', async () => {
    process.argv = ['node', './script']
    const fn = jest.fn()
    await oclip({
      run: () => fn('abc')
    }).exec()
    expect(fn).toBeCalledWith('abc')
  })

  test('passes through return value', () => {
    return expect(oclip({
      run: () => 123
    }).exec([])).resolves.toEqual(123)
  })

  test('gets homedir', () => {
    return oclip({
      run: ({ctx}) => expect(ctx.dirs.home).toMatch(/^\//)
    }).exec([])
  })
})

describe('subcommands', () => {
  test('runs subcommand', async () => {
    const fn = jest.fn()
    await oclip({children: {
      foo: oclip({
        run: () => fn(),
      })
    }}).exec(['foo'])
    expect(fn).toBeCalledTimes(1)
  })
  test('runs subcommand with arg', async () => {
    const fn = jest.fn()
    await oclip({children: {
      foo: oclip({
        args: [arg('BAR')],
        run: ({args}) => fn(args),
      }),
    }}).exec(['foo', 'bar'])
    expect(fn).toBeCalledWith(['bar'])
  })
})
