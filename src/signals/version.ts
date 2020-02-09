import Context from '../context'

export class VersionSignal extends Error {
  render(ctx: Context) {
    return `${ctx.name} version: ${ctx.version}`
  }
}
