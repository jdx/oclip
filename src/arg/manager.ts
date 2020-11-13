import { ArgConfig } from "./config.ts";
import { Arg, ArgTypes } from "./types.ts";

type ArgTypeStr_FromOpts<AO extends ArgConfig<unknown>> = AO extends
  { rest: true } ? "rest"
  : AO extends { optional: true } ? "optional"
  : "required";

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
export class ArgManager<
  AL extends readonly Arg[],
> {
  static init(): ArgManager<[]> {
    return new ArgManager([]);
  }
  private constructor(public list: AL) {}

  append<A extends Arg>(
    arg: A,
  ): ArgManager<[...AL, A]> {
    return new ArgManager([...this.list, arg]);
  }

  lastArgType(): keyof ArgTypes | undefined {
    const arg = this.list[this.list.length - 1];
    if (!arg) return;
    return arg.type;
  }

  get nextID(): number {
    return this.list.length;
  }
}
