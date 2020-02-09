import {HelpSignal} from './help'
import { command } from '../command'
import Context from '../context'
import path = require('path')
import { topic } from '../topic'

const proc = path.basename(process.argv[1])

test('command', () => {
  const ctx = new Context(command({run() {}}))
  const hs = new HelpSignal(ctx)
  expect(hs.render()).toEqual(`Usage: ${proc}\n`)
})

test('topic', () => {
  const ctx = new Context(topic({children: {}}))
  const hs = new HelpSignal(ctx)
  expect(hs.render()).toEqual(`Usage: ${proc}

Commands:
  [this topic has no commands]
`)
})
