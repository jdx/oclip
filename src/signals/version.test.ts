import { command } from '../command'

const {version} = require('../../package.json')

test('version', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
  await command({run: () => {}}).exec(['--version'])
  expect(spy).toHaveBeenCalledWith(`oclip version: ${version}`)
})
