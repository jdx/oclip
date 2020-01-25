import {oclip, arg} from '.'
import { RequiredArgsError } from './errors'

describe('required', () => {
  test('parses single arg', async () => {
    await oclip({args: [arg('FOO')]})
      .run(['foo'], ({args}) => {
        expect(args).toEqual(['foo'])
      })
  })
  test('parses 2 args', async () => {
    await oclip({args: [arg('FOO'), arg('BAR')]})
      .run(['foo', 'bar'], ({args}) => {
        expect(args).toEqual(['foo', 'bar'])
      })
  })
  test('throws on missing arg', async () => {
    const cmd = oclip({args: [arg('FOO'), arg('BAR')]}).run(['foo'])
    await expect(cmd).rejects.toThrowError(RequiredArgsError)
  })
  test('throws on missing arg', async () => {
    const cmd = oclip({args: [arg.required('FOO'), arg.required('BAR')]}).run(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('required by default', async () => {
    const cmd = oclip({args: [arg('FOO'), arg('BAR')]}).run(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('throws when extra arg', async () => {
    const cmd = oclip({args: [arg('FOO')]}).run(['foo', 'bar'])
    await expect(cmd).rejects.toThrowError(/Unexpected argument: bar/)
  })
})

describe('optional', () => {
  test('parses single arg', async () => {
    await oclip({args: [arg.optional('FOO')]})
      .run(['foo'], ({args}) => {
        expect(args).toEqual(['foo'])
      })
  })
  test('parses 2 args', async () => {
    await oclip({args: [arg.optional('FOO'), arg.optional('BAR')]})
      .run(['foo', 'bar'], ({args}) => {
        expect(args).toEqual(['foo', 'bar'])
      })
  })
  test('ignores missing arg', async () => {
    await oclip({args: [arg('FOO'), arg.optional('BAR')]})
      .run(['foo'], ({args}) => {
        expect(args).toEqual(['foo'])
      })
  })
})

describe('rest', () => {
  test('parses single arg', () => {
    return oclip({args: [arg.rest('FOO')]})
      .run(['foo'], ({args}) => {
        expect(args).toEqual(['foo'])
      })
  })
  test('parses 2 args', () => {
    return oclip({args: [arg.rest('FOO')]})
      .run(['foo', 'bar'], ({args}) => {
        expect(args).toEqual(['foo', 'bar'])
      })
  })
  test('parses rest args after normal arg', () => {
    return oclip({args: [arg('FOO'), arg.rest('BAR')]})
      .run(['foo', 'bar', 'baz'], ({args}) => {
        expect(args).toEqual(['foo', 'bar', 'baz'])
      })
  })
})

describe('parse', () => {
  test('runs parse function', () => {
    return oclip({args: [arg('FOO', {parse: s => parseInt(s)})]})
      .run(['123'], ({args}) => {
        expect(args).toEqual([123])
      })
  })
})

describe('argBuilder', () => {
  test('name only', () => {
    return oclip({args: [arg('FOO')]})
      .run(['foo'], ({ctx}) => {
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO'})
      })
  })
  test('name/desc', () => {
    return oclip({args: [arg('FOO', 'DESC')]})
      .run(['foo'], ({ctx}) => {
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO', description: 'DESC'})
      })
  })
  test('name/desc/options', () => {
    return oclip({args: [arg('FOO', 'DESC', {parse: s => parseInt(s)})]})
      .run(['123'], ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO', description: 'DESC'})
      })
  })
  test('undefined options', () => {
    return oclip({args: [arg('FOO', 'DESC', undefined)]})
      .run(['foo'], ({args, ctx}) => {
        expect(args).toEqual(['foo'])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO', description: 'DESC'})
      })
  })
  test('name/options', () => {
    return oclip({args: [arg('FOO', {parse: s => parseInt(s)})]})
      .run(['123'], ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO'})
      })
  })
  test('options only', () => {
    return oclip({args: [arg({parse: s => parseInt(s)})]})
      .run(['123'], ({args}) => {
        expect(args).toEqual([123])
      })
  })
  test('extend', () => {
    const numArg = arg.extend({parse: s => parseInt(s)})
    return oclip({args: [numArg('FOO')]})
      .run(['123'], ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.command.options.args[0]).toMatchObject({name: 'FOO'})
      })
  })
})
