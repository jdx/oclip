import type { Arg } from './args'
import type { Flags } from './flags'

export interface Options<TArgs extends Arg<any>[], TFlags extends Flags> {
  args?: TArgs
  flags?: TFlags
}
