// deno-lint-ignore-file no-explicit-any

// Gets the length of an array/tuple type. Example:
//
//   type FooLength = LengthOfTuple<[string, number, boolean]>;
//   //=> 3
//
export type LengthOfTuple<T extends readonly any[]> = T extends {
  length: infer L;
}
  ? L
  : never;

// Drops the first element of a tuple. Example:
//
//   type Foo = DropFirstInTuple<[string, number, boolean]>;
//   //=> [number, boolean]
//
export type DropFirstInTuple<T extends readonly any[]> = ((
  ...args: T
) => any) extends (arg: any, ...rest: infer U) => any
  ? U
  : T;

// Gets the type of the last element of a tuple. Example:
//
//   type Foo = LastInTuple<[string, number, boolean]>;
//   //=> boolean
//
//   function lastArg<T extends any[]>(...args: T): LastInTuple<T> {
//     return args[args.length - 1];
//   }
//
//   const bar = lastArg(1);
//   type Bar = typeof bar;
//   //=> number
//
//   const baz = lastArg(1, true, "hey", 123, 1, 2, 3, 4, 5, 6, 7, -1, false);
//   type Baz = typeof baz;
//   //=> boolean
//
export type LastInTuple<T extends readonly any[]> = T[LengthOfTuple<
  DropFirstInTuple<T>
>];
