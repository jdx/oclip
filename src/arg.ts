// deno-lint-ignore-file no-explicit-any

export type ParseFn<T> = (input: string) => T | Promise<T>;
export type ObjectOrPromiseOrFunction<T> =
  | T
  | Promise<T>
  | (() => T | Promise<T>);

export interface ArgOptions<T = unknown> {
  name: string;
  description?: string;
  hidden: boolean;

  required?: boolean;
  rest?: boolean;

  parse?: ParseFn<T>;
  default?: ObjectOrPromiseOrFunction<T>;
  choices?: ObjectOrPromiseOrFunction<string>;
}

interface ArgBaseOptions<T> extends ArgOptions<T> {
  id: number;
  parse: ParseFn<T>;
}

export abstract class ArgBase<T> {
  constructor(opts: ArgBaseOptions<T>) {
    this.id = opts.id;
    this.name = opts.name;
    this.description = opts.description;
    this.required = !!opts.required;
    this.rest = !!opts.rest;
    this.parse = opts.parse;
    this.default = opts.default;
  }
  id: number;
  name: string;
  description?: string;
  required: boolean;
  rest: boolean;

  parse: ParseFn<T>;
  default?: ObjectOrPromiseOrFunction<T>;
}

export class RequiredArg<T> extends ArgBase<T> {
  required = true;
  value!: T;
}
export class OptionalArg<T> extends ArgBase<T> {
  required = false;
  value?: T;
}
export class RestArg<T> extends ArgBase<T> {
  rest = true;
  value: T[] = [];
}
export type Arg<T = unknown> = RequiredArg<T> | OptionalArg<T> | RestArg<T>;

type ArgDataType_FromOptions<AO extends ArgOptions> = AO["parse"] extends
  (input: string) => infer T ? T : string;

type Arg_FromOptions<AO extends ArgOptions> = AO["rest"] extends true
  ? RestArg<ArgDataType_FromOptions<AO>>
  : AO["required"] extends true ? RequiredArg<ArgDataType_FromOptions<AO>>
  : OptionalArg<ArgDataType_FromOptions<AO>>;

export type ArgList = readonly Arg[];
export type ArgList_Append<AL extends ArgList, AO extends ArgOptions> = [
  ...AL,
  Arg_FromOptions<AO>,
];

export function appendArg<AO extends ArgOptions, AL extends ArgList>(
  list: AL,
  opts: AO,
): ArgList_Append<AL, AO> {
  let arg: Arg;
  const fullOpts = {
    id: list.length,
    parse: (input: string) => input,
    ...opts,
  };
  if (opts.rest) arg = new RestArg(fullOpts);
  else if (opts.required) arg = new RequiredArg(fullOpts);
  else arg = new OptionalArg(fullOpts);

  return [...list, arg as any];
}

class CMD<AL extends ArgList> {
  static init(): CMD<[]> {
    return new CMD([]);
  }

  constructor(private readonly args: AL) {}

  arg<AO extends ArgOptions>(
    name: string,
    // opts: Omit<AO, 'name'>,
    opts: AO,
  ): CMD<ArgList_Append<AL, AO>> {
    return new CMD(appendArg(this.args, { ...opts, name }));
  }
}

const cmd = CMD.init()
  .arg("foo1", { name: "1", parse: () => 1 })
  .arg("foo2", { name: "1", required: true })
  .arg("foo3", { name: "1" })
  .arg("foo4", { name: "1" });
cmd;
console.log(cmd);
