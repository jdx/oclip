export abstract class OclipError extends Error {
  constructor(options: { message: string }) {
    options.message += '\nSee more help with --help'
    super(options.message)
  }

  render() { return this.message }
}

export function unhandledRejectionHandler(reason: unknown) {
  if (reason instanceof OclipError) {
    console.error(reason.render())
    process.exit(190)
  } else throw reason
}

(function init() {
  process.on('unhandledRejection', unhandledRejectionHandler)
})()
