export type UnPromisify<T> = T extends Promise<infer U> ? U : T;
export type ObjectOrPromiseOrFunction<T> =
  | UnPromisify<T>
  | (() => UnPromisify<T>);
