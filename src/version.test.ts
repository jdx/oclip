import {oclip} from '.'

test('version', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
  await oclip({run: () => {}}).parse(['--version'])
  expect(spy).toHaveBeenCalledWith('oclip version: 0.0.0')
})
