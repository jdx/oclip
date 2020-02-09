import { command } from '../command'
import { topic } from '..'
import Context from '../context'
import { topicHelp } from './topic'
import path = require('path')

const proc = path.basename(process.argv[1])

test('help signal', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
  await topic({
    children: {
      foo: command({run() {}})
    }
  }).exec([])
  expect(spy).toHaveBeenCalledWith(`Usage: ${proc}

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
  expect(topicHelp(ctx, t)).toEqual(`Usage: ${proc}

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
  expect(topicHelp(ctx, t)).toEqual(`Usage: ${proc}

Commands:
  foo # sample command
`)})
