export abstract class OclipError extends Error {
  constructor(options: { message: string }) {
    super(options.message)
  }

  code = 190
  render(): string { return this.message }
}

export function unhandledRejectionHandler(reason: unknown): void {
  if (reason instanceof OclipError) {
    console.error(reason.render())
    process.exit(reason.code)
  } else throw reason
}

(function init() {
  process.on('unhandledRejection', unhandledRejectionHandler)
})()
