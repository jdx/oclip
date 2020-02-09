import { OclipError } from './oclip'
import type { Flag } from '../parsing/flags'

export class RequiredFlagError extends OclipError {
  public flags: Flag<any>[]

  constructor({flags}: { flags: Flag<any>[] }) {
    // const usage = m.list.renderList(m.help.flagUsages([flag], {displayRequired: false}))
    // const message = `Missing required flag:\n${usage}`
    let message = `Missing required flag${flags.length > 1 ? 's' : ''}: ${flags.map(f => f.toString()).join('\n')}`
    message += '\nSee more help with --help'
    super({message})
    this.flags = flags
  }
}
