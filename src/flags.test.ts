import {flag, command} from '.'

describe('boolean', () => {
  test('sets true', async () => {
    const run = jest.fn()
    await command({
      flags: {
        foo: flag.boolean()
      },
      run,
    }).exec(['--foo'])
    expect(run).toBeCalledWith(expect.objectContaining({flags: {foo: true}}))
  })

  describe('allowNo', () => {
    test('sets to false on --no-foo', () => {
      return command({
        flags: {
          foo: flag.boolean({allowNo: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: false}),
      }).exec(['--no-foo'])
    })
    test('sets to true normally', () => {
      return command({
        flags: {
          foo: flag.boolean({allowNo: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: true}),
      }).exec(['--foo'])
    })
  })
})

describe('input', () => {
  test('sets a flag', async () => {
    return command({
      flags: {
        foo: flag.input()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foo', 'bar'])
  })
  test('sets a flag with `=`', async () => {
    return command({
      flags: {
        foo: flag.input()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foo=bar'])
  })
  test('sets a flag with no space', async () => {
    return command({
      flags: {
        foo: flag.input()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foobar'])
  })

  describe('parse', () => {
    test('parses', async () => {
      return command({
        flags: {
          foo: flag.input({parse: s => parseInt(s)})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: 123}),
      }).exec(['--foo=123'])
    })
  })
  describe('multiple', () => {
    test('returns empty array with nothing', async () => {
      return command({
        flags: {
          foo: flag.input({multiple: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: []}),
      }).exec([])
    })
    test('gets multiple', async () => {
      return command({
        flags: {
          foo: flag.input({multiple: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: ['123', '1234']}),
      }).exec(['--foo=123', '--foo', '1234'])
    })
    test('parses individually', async () => {
      return command({
        flags: {
          foo: flag.input({multiple: true, parse: s => s.length})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: [3, 4]}),
      }).exec(['--foo=123', '--foo', '1234'])
    })
  })
  describe('required', () => {
    test('accepts input', () => {
      return command({
        flags: {
          foo: flag.input(),
          bar: flag.input({required: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: '123', bar: '234'}),
      }).exec(['--foo=123', '--bar', '234'])
    })
    test('fails if missing', () => {
      return expect(command({
        flags: {
          foo: flag.input(),
          bar: flag.input({required: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: '123'}),
      }).exec(['--foo=123'])).rejects.toThrowError(/Missing required flag: --bar/)
    })
  })
})
