export type FlagDef<K extends string, T = unknown> = {
  name: K;
  parse: (input: string) => T;
};
export type FlagDict = { [k: string]: FlagDef<any> };
export type FlagValues<FD extends FlagDict> = { [K in keyof FD]: ReturnType<FD[K]['parse']> };

export class FlagBuilder<F extends FlagDef<any>> {
  static init<K extends string>(name: K): FlagBuilder<FlagDef<K, string>> {
    return new FlagBuilder({
      name,
      parse: s => s,
    });
  }

  private constructor(readonly value: F) {}
}
