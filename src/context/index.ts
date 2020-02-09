import * as os from 'os'

import { Command } from '../command'
import { Topic } from '../topic'
import { findNearestPJSON } from './pjson'

export default class Context {
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

  pjson = findNearestPJSON()
  name = this.pjson.name || 'oclip-cli'
  version = this.pjson.version || '?.?.?'
}
