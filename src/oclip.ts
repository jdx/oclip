import { Topic, Options, TopicOptions } from './topic'
import { Command } from './command'
import { Arg, RestArg } from './args'
import { Flags } from './flags'

export const oclip: Oclip = (options: Options): any => 'children' in options ? new Topic(options) : new Command(options)

export type ArgVal<A extends Arg<any>> = A extends {required: false} ? ReturnType<A['parse']> | undefined : ReturnType<A['parse']>

export interface Oclip {
  (options: TopicOptions): Topic
  <F extends Flags, A1 extends Arg<any>, A2 extends Arg<any>, R>(options: Options<[A1, A2], F, R, [ArgVal<A1>, ArgVal<A2>]>): Command
  <F extends Flags, A1 extends RestArg<any>, R>(options: Options<[A1], F, R, ArgVal<A1>[]>): Command
  <F extends Flags, A1 extends Arg<any>, R>(options: Options<[A1], F, R, ArgVal<A1>[]>): Command
  <F extends Flags, R>(options: Options<[], F, R, []>): Command
  <F extends Flags, A extends Arg<any>, R>(options: Options<A[], F, R, ArgVal<A>[]>): Command
}
