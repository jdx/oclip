import {oclip, arg} from '.'
import { RequiredArgsError } from './errors'

describe('required', () => {
  test('parses single arg', async () => {
    await oclip({
      args: [arg('FOO')],
      run({args}) {
        expect(args).toEqual(['foo'])
      }
    }).parse(['foo'])
  })
  test('parses 2 args', async () => {
    await oclip({
      args: [arg('FOO'), arg('BAR')],
      run({args}) {
        expect(args).toEqual(['foo', 'bar'])
      }
    }).parse(['foo', 'bar'])
  })
  test('throws on missing arg', async () => {
    const cmd = oclip({args: [arg('FOO'), arg('BAR')]}).parse(['foo'])
    await expect(cmd).rejects.toThrowError(RequiredArgsError)
  })
  test('throws on missing arg', async () => {
    const cmd = oclip({args: [arg.required('FOO'), arg.required('BAR')]}).parse(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('required by default', async () => {
    const cmd = oclip({args: [arg('FOO'), arg('BAR')]}).parse(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('throws when extra arg', async () => {
    const cmd = oclip({args: [arg('FOO')]}).parse(['foo', 'bar'])
    await expect(cmd).rejects.toThrowError(/Unexpected argument: bar/)
  })
})

describe('optional', () => {
  test('parses single arg', async () => {
    await oclip({
      args: [arg.optional('FOO')],
      run: ({args}) => expect(args).toEqual(['foo'])
    }).parse(['foo'])
  })
  test('parses 2 args', async () => {
    await oclip({
      args: [arg.optional('FOO'), arg.optional('BAR')],
      run: ({args}) => expect(args).toEqual(['foo', 'bar'])
    }).parse(['foo', 'bar'])
  })
  test('ignores missing arg', async () => {
    await oclip({
      args: [arg('FOO'), arg.optional('BAR')],
      run: ({args}) => expect(args).toEqual(['foo']),
    }).parse(['foo'])
  })
})

describe('rest', () => {
  test('parses single arg', () => {
    return oclip({
      args: [arg.rest('FOO')],
      run: ({args}) => expect(args).toEqual(['foo'])
    }).parse(['foo'])
  })
  test('parses 2 args', () => {
    return oclip({
      args: [arg.rest('FOO')],
      run: ({args}) => expect(args).toEqual(['foo', 'bar']),
    }).parse(['foo', 'bar'])
  })
  test('parses rest args after normal arg', () => {
    return oclip({
      args: [arg('FOO'), arg.rest('BAR')],
      run: ({args}) => expect(args).toEqual(['foo', 'bar', 'baz'])
    }).parse(['foo', 'bar', 'baz'])
  })
})

describe('parse', () => {
  test('runs parse function', () => {
    return oclip({
      args: [arg('FOO', {parse: s => parseInt(s)})],
      run: ({args}) => expect(args).toEqual([123])
    }).parse(['123'])
  })
})

describe('argBuilder', () => {
  test('name only', () => {
    return oclip({
      args: [arg('FOO')],
      run: ({ctx}) => expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO'})
    }).parse(['foo'])
  })
  test('name/desc', () => {
    return oclip({
      args: [arg('FOO', 'DESC')],
      run: ({ctx}) => expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO', description: 'DESC'}),
    }).parse(['foo'])
  })
  test('name/desc/options', () => {
    return oclip({
      args: [arg('FOO', 'DESC', {parse: s => parseInt(s)})],
      run: ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO', description: 'DESC'})
      }
    }).parse(['123'])
  })
  test('undefined options', () => {
    return oclip({
      args: [arg('FOO', 'DESC', undefined)],
      run: ({args, ctx}) => {
        expect(args).toEqual(['foo'])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO', description: 'DESC'})
      }
    }).parse(['foo'])
  })
  test('name/options', () => {
    return oclip({
      args: [arg('FOO', {parse: s => parseInt(s)})],
      run: ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO'})
      }
    }).parse(['123'])
  })
  test('options only', () => {
    return oclip({
      args: [arg({parse: s => parseInt(s)})],
      run: ({args}) => expect(args).toEqual([123])
    }).parse(['123'])
  })
  test('extend', () => {
    const numArg = arg.extend({parse: s => parseInt(s)})
    return oclip({
      args: [numArg('FOO')],
      run: ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO'})
      }
    }).parse(['123'])
  })
})
