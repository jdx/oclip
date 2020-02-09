import assert from './assert'

test('asserts ok', () => {
  assert(true)
})

test('asserts fail', () => {
  expect(() => {
    assert(false)
  }).toThrowError('assertion failed')
})
