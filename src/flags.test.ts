import oclip, {flag} from '.'

describe('boolean', () => {
  test('sets true', async () => {
    const run = jest.fn()
    await oclip({
      flags: {
        foo: flag.boolean()
      },
      run,
    }).exec(['--foo'])
    expect(run).toBeCalledWith(expect.objectContaining({flags: {foo: true}}))
  })

  describe('allowNo', () => {
    test('sets to false on --no-foo', () => {
      return oclip({
        flags: {
          foo: flag.boolean({allowNo: true})
        },
        run: ({flags}) => expect(flags).toMatchObject({foo: false}),
      }).exec(['--no-foo'])
    })
  })
})

describe('option', () => {
  test('sets a flag', async () => {
    return oclip({
      flags: {
        foo: flag.input()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foo', 'bar'])
  })
  test('sets a flag with `=`', async () => {
    return oclip({
      flags: {
        foo: flag.input()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foo=bar'])
  })
  test('sets a flag with no space', async () => {
    return oclip({
      flags: {
        foo: flag.input()
      },
      run: ({flags}) => expect(flags).toMatchObject({foo: 'bar'}),
    }).exec(['--foobar'])
  })
})
