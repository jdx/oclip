import { ArgConfig, ArgOptions } from "./config.ts";

export abstract class ArgBase<D> {
  constructor(protected cfg: ArgConfig<D>) {
    this.name = cfg.name;
  }
  public readonly name: string;

  toString(): string {
    let s = "";
    if (this.cfg.hidden) return s;
    if (this.cfg.name) {
      s += `${this.cfg.name.toUpperCase()}`;
    }
    //if (!usage) return s;
    return s;
  }
}

export class RequiredArg<D = unknown> extends ArgBase<D> {
  type = "required" as const;
  optional = false;
  value!: D;
}

export class OptionalArg<D = unknown> extends ArgBase<D> {
  type = "optional" as const;
  optional = true;
  value?: D;
}

export class RestArg<D = unknown> extends ArgBase<D> {
  type = "rest" as const;
  rest = true;
  value: D[] = [];
}

export type Arg<D = unknown> = RequiredArg<D> | OptionalArg<D> | RestArg<D>;

export interface ArgTypes {
  required: RequiredArg;
  optional: OptionalArg;
  rest: RestArg;
}

type ArgTypeStrFromOpts<AO extends ArgOptions<unknown>> = AO extends {
  rest: true;
}
  ? "rest"
  : AO extends { optional: true }
  ? "optional"
  : "required";

export type ArgTypeFromOpts<
  AO extends ArgOptions<unknown>,
  D
> = ArgTypeStrFromOpts<AO> extends "rest"
  ? RestArg<D>
  : ArgTypeStrFromOpts<AO> extends "optional"
  ? OptionalArg<D>
  : RequiredArg<D>;
