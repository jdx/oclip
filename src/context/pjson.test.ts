import {findNearestPJSON} from './pjson'

test('finds pjson', () => {
  const pjson = findNearestPJSON()
  expect(pjson.name).toBe('oclip')
})

test('fails to find pjson eventually', () => {
  expect(() => findNearestPJSON('/foo/bar/baz'))
    .toThrowError('Cannot find module')
})
