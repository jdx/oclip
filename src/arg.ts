import { ParseFn } from './util';

export type ArgKind = 'required' | 'optional';

export interface Arg<T = any, TKind extends ArgKind = any> {
  id: number;
  name?: string;
  parse: ParseFn<T>;
  kind: TKind;
}

export type RequiredArg<T = unknown> = Arg<T, 'required'>;
export type OptionalArg<T = unknown> = Arg<T, 'optional'>;

export type ArgType<A extends Arg> = ReturnType<A['parse']>;
export type ArgValue<A extends Arg> = A extends Arg<infer T, infer K>
  ? K extends 'optional'
    ? T | undefined
    : T
  : never;

export type ArgList = readonly Arg[];
export type ArgValues<Args extends ArgList> = {
  [A in keyof Args]: Args[A] extends Args[number] ? ArgValue<Args[A]> : never;
};

let lastID = 0;

export class ArgBuilder<A extends Arg> {
  static init(): ArgBuilder<OptionalArg<string>> {
    return new ArgBuilder({
      id: lastID++,
      parse: s => s,
      kind: 'optional',
    });
  }

  private constructor(readonly value: A) {}

  name(name: string): ArgBuilder<A> {
    return new ArgBuilder({ ...this.value, name });
  }

  required(): ArgBuilder<RequiredArg<ArgType<A>>> {
    return new ArgBuilder({ ...this.value, kind: 'required' });
  }

  optional(): ArgBuilder<OptionalArg<ArgType<A>>> {
    return new ArgBuilder({ ...this.value, kind: 'optional' });
  }

  parse<T>(parse: ParseFn<T>): ArgBuilder<Arg<T, A['kind']>> {
    return new ArgBuilder({ ...this.value, parse });
  }

  string(): ArgBuilder<Arg<string, A['kind']>> {
    return this.parse(s => s);
  }

  number(): ArgBuilder<Arg<number, A['kind']>> {
    return this.parse(s => parseInt(s, 10));
  }
}
