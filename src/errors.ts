export class OclipError extends Error{}

export class UnexpectedArgumentException extends OclipError {
  constructor(arg: string) {
    super(`Unexpected argument: ${arg}`);
  }
}
