import {flag} from './flags'
import {command} from '..'

describe('bool', () => {
  describe('toString', () => {
    test('unknown flag', () => {
      const f = flag.bool()
      expect(f.toString()).toEqual('UNKNOWN FLAG')
    })
    test('simple', () => {
      const f = flag.bool()
      f.name = 'foo'
      expect(f.toString()).toEqual('--foo')
    })
    test('short', () => {
      const f = flag.bool('f')
      f.name = 'foo'
      expect(f.toString()).toEqual('-f, --foo')
    })
  })
  test('sets true', async () => {
    const run = jest.fn()
    await command({
      flags: {
        foo: flag.bool()
      },
      run,
    }).exec(['--foo'])
    expect(run).toBeCalledWith(expect.objectContaining({flags: {foo: true}}))
  })

  describe('allowNo', () => {
    test('sets to false on --no-foo', () => {
      return command({
        flags: {
          foo: flag.bool({allowNo: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: false}),
      }).exec(['--no-foo'])
    })
    test('sets to true normally', () => {
      return command({
        flags: {
          foo: flag.bool({allowNo: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: true}),
      }).exec(['--foo'])
    })
  })

  test('short flags', () => {
    return command({
      flags: {
        foo: flag.bool('f'),
        bar: flag.bool('b'),
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: true, bar: true}),
    }).exec(['-fb'])
  })

  describe('multibool', () => {
    test('gets 0 by default', () => {
      return command({
        flags: {
          verbose: flag.multibool(),
        },
        run: ({flags}) => expect(flags).toMatchObject({verbose: 0}),
      }).exec([])
    })
    test('gets 4', () => {
      return command({
        flags: {
          verbose: flag.multibool('v'),
        },
        run: ({flags}) => expect(flags).toMatchObject({verbose: 4}),
      }).exec(['-v', '--verbose', '-vv'])
    })
  })

  test('can handle -v without showing version', () => {
    return command({
      flags: {
        verbose: flag.bool({char: 'v'})
      },
      run: ({flags}) => expect(flags).toMatchObject({verbose: true}),
    }).exec(['-v'])
  })
})

describe('input', () => {
  test('sets a flag', async () => {
    return command({
      flags: {
        foo: flag()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foo', 'bar'])
  })
  test('sets a flag with `=`', async () => {
    return command({
      flags: {
        foo: flag()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foo=bar'])
  })
  test('sets a flag with no space', async () => {
    return command({
      flags: {
        foo: flag()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foobar'])
  })

  describe('parse', () => {
    test('parses', async () => {
      return command({
        flags: {
          foo: flag({parse: s => parseInt(s)})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: 123}),
      }).exec(['--foo=123'])
    })
  })
  describe('multiple', () => {
    test('returns empty array with nothing', async () => {
      return command({
        flags: {
          foo: flag.multiple()
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: []}),
      }).exec([])
    })
    test('gets multiple', async () => {
      return command({
        flags: {
          foo: flag.multiple()
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: ['123', '1234']}),
      }).exec(['--foo=123', '--foo', '1234'])
    })
    test('parses individually', async () => {
      return command({
        flags: {
          foo: flag.multiple('x', {parse: s => s.length})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: [3, 4, 5]}),
      }).exec(['--foo=123', '--foo', '1234', '-x12345'])
    })
  })
  describe('required', () => {
    test('accepts input', () => {
      return command({
        flags: {
          foo: flag(),
          bar: flag({required: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: '123', bar: '234'}),
      }).exec(['--foo=123', '--bar', '234'])
    })
    test('fails if missing', () => {
      return expect(command({
        flags: {
          foo: flag(),
          bar: flag({required: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: '123'}),
      }).exec(['--foo=123'])).rejects.toThrowError(/Missing required flag: --bar/)
    })
  })
  describe('choices', () => {
    test('accepts input', () => {
      return command({
        flags: {
          foo: flag({choices: ['a']}),
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: 'a'}),
      }).exec(['--foo=a'])
    })
    test('fails if missing', () => {
      return expect(command({
        flags: {
          foo: flag({choices: ['b']}),
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: 'a'}),
      }).exec(['--foo=a']))
        .rejects.toThrow('Expected a to be one of: b')
    })
  })
})
