import { OclipError } from '../errors';
import Context from '../context';

export class Signal extends OclipError {
  constructor(readonly ctx: Context, readonly type: string) {
    super({ message: `${type} signal` });
  }
}
