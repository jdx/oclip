#!/usr/bin/env -S deno run --allow-run

import exec from "../lib/exec.ts";

try {
  await exec(["deno", "lint", "--unstable"]);
  await exec(["deno", "fmt", "--check"]);
} catch {
  Deno.exit(1);
}
