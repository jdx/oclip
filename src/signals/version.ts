import Context from '../context';
import { Signal } from '.';

export class VersionSignal extends Signal {
  constructor(ctx: Context) {
    super(ctx, 'version');
  }
  code = 0;
  render(): string {
    return `${this.ctx.name} version: ${this.ctx.version}`;
  }
}
