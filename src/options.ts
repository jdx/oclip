import { Arg, } from './args'
import { Flags } from './flags'

export interface Options<A extends Arg<any>[], F extends Flags> {
  args?: A
  flags?: F
}

export type FullOptions<A extends Arg<any>[], F extends Flags> = Options & {
  args: A
  flags: F
}
