import { OclipError, unhandledRejectionHandler } from './oclip';

class TestError extends OclipError {}

describe('unhandledRejectionHandler', () => {
  test('handles ocliperror', () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    jest.spyOn(process, 'exit').mockImplementationOnce(() => {
      throw new Error('xxx');
    });
    expect(() =>
      unhandledRejectionHandler(new TestError({ message: 'foobar' })),
    ).toThrowError('xxx');
  });
  test('emits other errors', () => {
    expect(() => unhandledRejectionHandler(new Error('foobar'))).toThrowError(
      'foobar',
    );
  });
});
