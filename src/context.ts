import { Command } from './command'
import { Flags } from './flags'
import * as os from 'os'

export class Context<F extends Flags, R> {
  constructor(readonly command: Command<F, R>) {}

  dirs = {
    home: os.homedir(),
  }
}
