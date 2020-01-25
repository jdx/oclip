import { Command } from './command'
import * as os from 'os'

export class Context {
  constructor(readonly command: Command) {}

  dirs = {
    home: os.homedir(),
  }
}
