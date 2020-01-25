import {oclip, arg} from '.'

const argv = process.argv

describe('run', () => {
  afterEach(() => { process.argv = argv })

  test('runs with just a run function', async () => {
    process.argv = ['node', './script']
    const fn = jest.fn()
    await oclip({
      run: () => fn('abc')
    }).parse()
    expect(fn).toBeCalledWith('abc')
  })

  test('passes through return value', () => {
    return expect(oclip({
      run: () => 123
    }).parse([])).resolves.toEqual(123)
  })

  test('gets homedir', () => {
    return oclip({
      run: ({ctx}) => expect(ctx.dirs.home).toMatch(/^\//)
    }).parse([])
  })
})

describe('subcommands', () => {
  test('runs subcommand', async () => {
    const fn = jest.fn()
    await oclip({subcommands: {foo: oclip({
      run: () => fn(),
    })}}).parse(['foo'])
    expect(fn).toBeCalledTimes(1)
  })
  test('runs subcommand with arg', async () => {
    const fn = jest.fn()
    await oclip({subcommands: {
      foo: oclip({
        args: [arg('BAR')],
        run: ({args}) => fn(args),
      })
    }}).parse(['foo', 'bar'])
    expect(fn).toBeCalledWith(['bar'])
  })
})
