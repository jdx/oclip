import { Command } from './command'
import * as os from 'os'
import { Topic } from './topic'

export class Context {
  constructor(subject: Command | Topic) {
    this.helpSubject = subject
    if (subject instanceof Command) {
      this.command = subject
    } else {
      this.topic = subject
    }
  }

  dirs = {
    home: os.homedir(),
  }

  helpSubject: Command | Topic
  topic?: Topic
  command?: Command
}
