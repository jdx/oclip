import {oclip} from '.'

const {version} = require('../package.json')

test('version', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
  await oclip({run: () => {}}).exec(['--version'])
  expect(spy).toHaveBeenCalledWith(`oclip version: ${version}`)
})
