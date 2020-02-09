import * as os from 'os'

import { Command } from '../command'
import { Topic } from '../topic'
import { findNearestPJSON } from './pjson'
import path = require('path')

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

  subjectPath(subject: Command | Topic | undefined) {
    const p = []
    while (subject?.id) {
      p.unshift(subject.id)
      subject = subject.parent
    }
    p.unshift(path.basename(process.argv[1]))
    p.unshift(path.basename(process.argv[0]))
    return p.join(' ')
  }
}
