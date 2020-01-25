import {_parent} from '.'
import * as path from 'path'
import * as fs from 'fs'

export class VersionSignal extends Error {
  render() {
    let name = 'cli'
    let version = 'x.x.x'
    if (_parent) {
      const pjson = findNearestPJSON(path.dirname(_parent.filename))
      name = pjson.name || name
      version = pjson.version || version
    }
    return `${name} version: ${version}`
  }
}

function findNearestPJSON(p: string): PJSON {
  try {
    const data = fs.readFileSync(path.join(p, 'package.json'), 'utf8')
    return JSON.parse(data)
  } catch (err) {
    if (err.code === 'ENOENT' && path.dirname(p) !== p) {
      return findNearestPJSON(path.dirname(p))
    }
    throw err
  }
}

export interface PJSON {
  name: string
  version: string
}
