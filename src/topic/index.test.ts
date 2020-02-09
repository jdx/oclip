import {topic} from '.'
import * as path from 'path'

describe('lazy-loading', () => {
  test('loads/runs command', async () => {
    await topic({
      children: {
        foo: path.join(__dirname, '../../test/fixtures/command.js'),
      }
    }).exec(['foo'])
  })
})
