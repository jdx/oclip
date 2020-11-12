#!/usr/bin/env deno run --allow-run

import { run } from "../lib/exec.ts";

try {
  await run(
    ["deno", "fmt", "--unstable", "--ignore=node_modules", ...Deno.args],
  );
} catch {
  Deno.exit(1);
}
