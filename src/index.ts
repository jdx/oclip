export {oclip} from './command'
export {arg} from './args'

export let _parent: NodeModule['parent'] | undefined
if (module.parent) _parent = module.parent
