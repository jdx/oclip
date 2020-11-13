// deno-lint-ignore-file no-explicit-any

import { LastInTuple } from "./util.ts";
import { ArgConfig } from "./config.ts";
import { Arg, ArgTypes } from "./types.ts";

// function getValues<T extends ArgList, U extends Arg>(
//   ...list: [...T, U]
// ): [
//   ...(ArgList_ToValues<T>),
//   ...(U extends RestArg ? U["value"] : [U["value"]]),
// ] {
//   const tail = list.pop();
//   const results = list.map((a) => a.value);
//   if (tail instanceof RestArg) {
//     results.push(...tail.value);
//   } else if (tail) {
//     results.push(tail.value);
//   }
//   return results as any;
// }

// export class ArgList? {

type ArgList = readonly Arg[];
type LastArg<AL extends ArgList> = LastInTuple<AL> extends Arg
  ? LastInTuple<AL>
  : undefined;

export class ArgManager<AL extends ArgList> {
  static init(): ArgManager<[]> {
    return new ArgManager([]);
  }
  private constructor(public list: AL) {}

  append<A extends Arg>(arg: A): ArgManager<[...AL, A]> {
    return new ArgManager([...this.list, arg]);
  }

  lastArgType(): LastArg<AL> extends Arg ? LastArg<AL>["type"] : undefined {
    const arg = this.list[this.list.length - 1];
    if (!arg) return undefined as any;
    return arg.type as any;
  }

  get nextID(): number {
    return this.list.length;
  }
}
