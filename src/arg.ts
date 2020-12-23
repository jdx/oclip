type Overwrite<O, O1> = {
  [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
};

export type ParseFn<T> = (input: string) => T

export interface Arg<T> {
  parse: ParseFn<T>
  required: boolean
}

export type OptionalArg<T> = Arg<T> & { required: false }
export type RequiredArg<T> = Arg<T> & { required: true }

export class ArgBuilder<A extends Arg<unknown>> {
  constructor(readonly value: A) { }

  parse<T>(parse: ParseFn<T>): ArgBuilder<Overwrite<A, { parse: ParseFn<T> }>> {
    this.value.parse = parse;
    return this as any;
  }

  required(): ArgBuilder<Overwrite<A, { required: true }>> {
    this.value.required = true;
    return this as any;
  }

  optional(): ArgBuilder<Overwrite<A, { required: false }>> {
    this.value.required = false;
    return this as any;
  }
}

export function arg(): ArgBuilder<OptionalArg<string>> {
  return new ArgBuilder({
    parse: s => s,
    required: false,
  })
}

export type ArgValue<A extends Arg<any>> =
  A extends OptionalArg<infer T> ? T | undefined
  : A extends RequiredArg<infer T> ? T
  : never;
export type ArgValues<Args extends readonly Arg<any>[]> = { [A in keyof Args]: Args[A] extends Args[number] ? ArgValue<Args[A]> : never }
