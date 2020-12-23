import { command } from './command';
import { topic } from './topic';
import { arg } from './parsing/args';
import { flag } from './parsing/flags';
import * as errors from './errors';

export let _parent: NodeModule['parent'] | undefined;
if (module.parent) _parent = module.parent;

export { command, topic, arg, flag, errors };
