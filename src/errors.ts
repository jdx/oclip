import type { Arg } from './args'

export class OclipError extends Error {
  constructor(options: { message: string }) {
    options.message += '\nSee more help with --help'
    super(options.message)
  }

  render() {
    return this.message
  }
}

export class RequiredArgsError extends OclipError {
  public args: Arg<any>[]

  constructor({args}: { args: Arg<any>[] }) {
    let message = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`
    const namedArgs = args.filter(a => a.name)
    if (namedArgs.length > 0) {
      // const list = m.list.renderList(namedArgs.map(a => [a.name, a.description] as [string, string]))
      const list = namedArgs.map(a => [a.name, a.description])
      message += `:\n${list}`
    }
    super({message})
    this.args = args
  }
}

export class UnexpectedArgsError extends OclipError {
  public args: string[]

  constructor({args}: { args: string[] }) {
    const message = `Unexpected argument${args.length === 1 ? '' : 's'}: ${args.join(', ')}`
    super({message})
    this.args = args
  }
}

function init() {
  process.on('unhandledRejection', (reason, promise) => {
    if (reason instanceof OclipError) {
      console.error(reason.render())
      process.exit(190)
    } else throw reason
  })
}
init()
