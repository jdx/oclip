import {arg, command} from '..'
import { RequiredArgsError } from '../errors/args'

describe('required', () => {
  test('parses single arg', async () => {
    await command({
      args: [arg('FOO')],
      run({args}) {
        expect(args).toEqual(['foo'])
      }
    }).exec(['foo'])
  })
  test('parses 2 args', async () => {
    await command({
      args: [arg('FOO'), arg('BAR')],
      run({args}) {
        expect(args).toEqual(['foo', 'bar'])
      }
    }).exec(['foo', 'bar'])
  })
  test('throws on missing arg', async () => {
    const cmd = command({args: [arg('FOO'), arg('BAR')], run: () => {}}).exec(['foo'])
    await expect(cmd).rejects.toThrowError(RequiredArgsError)
  })
  test('throws on missing arg', async () => {
    const cmd = command({args: [arg.required('FOO'), arg.required('BAR')], run: () => {}}).exec(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('throws on missing arg and optional', async () => {
    const cmd = command({args: [arg.required('FOO'), arg.required('BAR'), arg.optional('BAZ')], run: () => {}}).exec(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('required by default', async () => {
    const cmd = command({args: [arg('FOO'), arg('BAR')], run: () => {}}).exec(['foo'])
    await expect(cmd).rejects.toThrowError(/Missing 1 required arg:\nBAR/)
  })
  test('throws when extra arg', async () => {
    const cmd = command({args: [arg('FOO')], run: () => {}}).exec(['foo', 'bar'])
    await expect(cmd).rejects.toThrowError(/Unexpected argument: bar/)
  })
})

describe('optional', () => {
  test('parses single arg', async () => {
    await command({
      args: [arg.optional('FOO')],
      run: ({args}) => expect(args).toEqual(['foo'])
    }).exec(['foo'])
  })
  test('parses 2 args', async () => {
    await command({
      args: [arg.optional('FOO'), arg.optional('BAR')],
      run: ({args}) => expect(args).toEqual(['foo', 'bar'])
    }).exec(['foo', 'bar'])
  })
  test('ignores missing arg', async () => {
    await command({
      args: [arg('FOO'), arg.optional('BAR')],
      run: ({args}) => expect(args).toEqual(['foo']),
    }).exec(['foo'])
  })
  test('required after optional is invalid', () => {
    return expect(() => command({
      args: [arg('FOO'), arg.optional('BAR'), arg.required('BAZ')],
      run: ({args}) => expect(args).toEqual(['foo']),
    })).toThrowError(/required arguments may not follow optional arguments/)
  })
})

describe('rest', () => {
  test('parses single arg', () => {
    return command({
      args: [arg.rest('FOO')],
      run: ({args}) => expect(args).toEqual(['foo'])
    }).exec(['foo'])
  })
  test('parses 2 args', () => {
    return command({
      args: [arg.rest('FOO')],
      run: ({args}) => expect(args).toEqual(['foo', 'bar']),
    }).exec(['foo', 'bar'])
  })
  test('parses rest args after normal arg', () => {
    return command({
      args: [arg('FOO'), arg.rest('BAR')],
      run: ({args}) => expect(args).toEqual(['foo', 'bar', 'baz'])
    }).exec(['foo', 'bar', 'baz'])
  })
})

describe('parse', () => {
  test('runs parse function', () => {
    return command({
      args: [arg('FOO', {parse: s => parseInt(s)})],
      run: ({args}) => expect(args).toEqual([123])
    }).exec(['123'])
  })
})

describe('argBuilder', () => {
  test('name only', () => {
    return command({
      args: [arg('FOO')],
      run: ({ctx}) => expect(ctx.subject.args[0]).toMatchObject({name: 'FOO'})
    }).exec(['foo'])
  })
  test('name/options', () => {
    return command({
      args: [arg('FOO', {parse: s => parseInt(s), description: 'DESC'})],
      run: ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.subject.args[0]).toMatchObject({name: 'FOO', description: 'DESC'})
      }
    }).exec(['123'])
  })
  test('undefined options', () => {
    return command({
      args: [arg('FOO', undefined)],
      run: ({args, ctx}) => {
        expect(args).toEqual(['foo'])
        expect(ctx.subject.args[0]).toMatchObject({name: 'FOO'})
      }
    }).exec(['foo'])
  })
  test('name/options', () => {
    return command({
      args: [arg('FOO', {parse: s => parseInt(s)})],
      run: ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.subject.args[0]).toMatchObject({name: 'FOO'})
      }
    }).exec(['123'])
  })
  test('options only', () => {
    return command({
      args: [arg({parse: s => parseInt(s)})],
      run: ({args}) => expect(args).toEqual([123])
    }).exec(['123'])
  })
  test('extend', () => {
    const numArg = arg.extend({parse: s => parseInt(s)})
    return command({
      args: [numArg('FOO')],
      run: ({args, ctx}) => {
        expect(args).toEqual([123])
        expect(ctx.subject.args[0]).toMatchObject({name: 'FOO'})
      }
    }).exec(['123'])
  })
})


describe('default', () => {
  test('basic default', () => {
    return command({
      args: [arg('FOO', {default: 123})],
      run: ({args}) => expect(args).toEqual([123])
    }).exec([])
  })
  test('basic default overridden by input', () => {
    return command({
      args: [arg('FOO', {default: 123})],
      run: ({args}) => expect(args).toEqual(['foo'])
    }).exec(['foo'])
  })
  test('default as function', () => {
    return command({
      args: [arg('FOO', {default: () => 123})],
      run: ({args}) => expect(args).toEqual([123])
    }).exec([])
  })
  test('default as async function', () => {
    return command({
      args: [arg('FOO', {default: async () => 123})],
      run: ({args}) => expect(args).toEqual([123])
    }).exec([])
  })
  test('default with undefined in the middle', () => {
    return command({
      args: [
        arg('A'),
        arg.optional('B', {default: () => undefined}),
        arg.optional('C', {default: () => 123}),
      ],
      run: ({args}) => expect(args).toEqual(['a', undefined, 123])
    }).exec(['a'])
  })
  test('default rest argument', () => {
    return command({
      args: [
        arg.rest('C', {default: 123}),
      ],
      run: ({args}) => expect(args).toEqual([123])
    }).exec([])
  })
})

describe('choices', () => {
  test('picks a choice', () => {
    return command({
      args: [
        arg('A', {choices: ['abc', '123']}),
      ],
      run: ({args}) => expect(args).toEqual(['123'])
    }).exec(['123'])
  })

  test('picks a choice from a promise', () => {
    return command({
      args: [
        arg('A', {choices: async () => ['abc', '123']}),
      ],
      run: ({args}) => expect(args).toEqual(['123'])
    }).exec(['123'])
  })

  test('picks a wrong choice', () => {
    return expect(command({
      args: [
        arg('A', {choices: ['abc', '123']}),
      ],
      run: ({args}) => expect(args).toEqual(['123'])
    }).exec(['124'])).rejects.toThrowError(/Expected "124" to be one of:\nabc\n123/)
  })
})
