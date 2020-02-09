import {topic} from '.'
import * as path from 'path'
import { command } from '../command'

describe('lazy-loading', () => {
  test('loads/runs command', async () => {
    await topic({
      children: {
        foo: path.join(__dirname, '../../test/fixtures/command.js'),
      }
    }).exec(['foo'])
  })
})

describe('error handling', () => {
  test('gets actual error from command', async () => {
    // jest.spyOn(process, 'exit').mockImplementationOnce(code => { throw new Error(code as any) })
    expect(topic({
      children: {
        foo: command({run() { throw new Error('xxx')}})
      }
    }).exec(['foo']))
      .rejects.toThrow('xxx')
  })
})
