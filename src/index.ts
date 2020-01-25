import {oclip} from './command'
import {arg} from './args'
import * as flag from './flags'

export let _parent: NodeModule['parent'] | undefined
if (module.parent) _parent = module.parent

export {
  oclip,
  oclip as default,
  arg,
  flag,
}
