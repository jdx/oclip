import { command } from '../command'
import {VersionSignal} from './version'
import Context from '../context'

const {version} = require('../../package.json')

test('signal', async () => {
  await expect(command({run: () => {}}).exec(['--version']))
    .rejects.toThrowError('VersionSignal')
})

test('render', () => {
  const vs = new VersionSignal()
  const ctx = new Context(command({run() {}}))
  expect(vs.render(ctx)).toEqual(`oclip version: ${version}`)
})
