/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path';
import { _parent } from '..';
import assert from '../util/assert';

export function findNearestPJSON(p?: string): PJSON {
  assert(_parent);
  if (!p) p = path.dirname(_parent.filename);
  try {
    const pjson = require(path.join(p, 'package.json'));
    pjson.oclip = pjson.oclip || {};
    return pjson;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && path.dirname(p) !== p) {
      return findNearestPJSON(path.dirname(p));
    }
    throw err;
  }
}

export interface PJSON {
  name: string;
  version: string;
  oclip: {
    bin?: string;
  };
}
