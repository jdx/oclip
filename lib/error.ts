// deno-lint-ignore-file no-explicit-any

import * as arg from "./arg.ts";

export abstract class OclipError extends Error {}
export abstract class ValidationError extends OclipError {}

export class RequiredArgAfterOptionalValidationError extends ValidationError {
  constructor(
    public readonly optional: arg.Arg<any>,
    public readonly required: arg.Arg<any>,
  ) {
    super(
      `Optional argument "${optional}" is followed by required argument "${required}"
It's not possible for the parser to be consistent with this configuration.

Either make them both required or optional, or swap their ordering.
`,
    );
  }
}

export class MultipleArgNotLastError extends ValidationError {
  constructor(
    public readonly arg: arg.MultipleArg<any>,
    public readonly next: arg.Arg<any>,
  ) {
    super(`Multiple argument "${arg}" must be the last argument defined.
Currently "${next}" follows that multiple argument. It's not possible for the parser to know if
an argument should be part of the multiple or the next argument in this case.

Remove "${next}" or swap it with "${arg}".
`);
  }
}
export class RequiredArgsError extends OclipError {
  public args: arg.List;

  constructor(args: arg.List) {
    let message = `Missing ${args.length} required arg${
      args.length === 1 ? "" : "s"
    }`;
    const list = args.map((a) => a.toString());
    message += `:\n${list}`;
    super(message);
    this.args = args;
  }
}

export class UnexpectedArgsError extends OclipError {
  public args: string[];

  constructor(args: string[]) {
    super(
      `Unexpected argument${args.length === 1 ? "" : "s"}: ${args.join(", ")}`,
    );
    this.args = args;
  }
}

export class InvalidChoiceError extends OclipError {
  public choices: string[];
  public input: string;

  constructor(choices: string[], input: string) {
    super(`Expected "${input}" to be one of:
${choices.join("\n")}
`);
    this.choices = choices;
    this.input = input;
  }
}
