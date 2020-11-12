/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AssertionError } from 'assert'

export default function assert(condition: any, message = 'assertion failed'): asserts condition {
  if (!condition) {
    throw new AssertionError({message})
  }
}
