import Context from '../context'

export class VersionSignal extends Error {
  constructor() {super('VersionSignal')}
  render(ctx: Context) {
    return `${ctx.name} version: ${ctx.version}`
  }
}
