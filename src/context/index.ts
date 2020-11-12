import * as os from 'os'

import { Command } from '../command'
import { Topic } from '../topic'
import { findNearestPJSON } from './pjson'
import path = require('path')

export type Subject = Command | Topic

export default class Context {
  constructor(readonly subject: Subject) {}

  dirs = {
    home: os.homedir(),
  }

  pjson = findNearestPJSON()
  name = this.pjson.name || 'oclip-cli'
  bin = this.pjson.oclip.bin
  version = this.pjson.version || '?.?.?'

  subjectPath(): string {
    const p = []
    let subject: Subject | undefined = this.subject
    while (subject?.id) {
      p.unshift(subject.id)
      subject = subject.parent
    }
    p.unshift(path.basename(process.argv[1]))
    // p.unshift(path.basename(process.argv[0])) node
    return p.join(' ')
  }
}
