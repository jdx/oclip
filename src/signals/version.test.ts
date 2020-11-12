/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
import { command } from '../command';
import { VersionSignal } from './version';
import Context from '../context';

const { version } = require('../../package.json');

test('signal', async () => {
  await expect(
    command({ run: () => {} }).exec(['--version']),
  ).rejects.toThrowError('version signal');
});

test('render', () => {
  const ctx = new Context(command({ run() {} }));
  const vs = new VersionSignal(ctx);
  expect(vs.render()).toEqual(`oclip version: ${version}`);
});
