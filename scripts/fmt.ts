import { run } from "./helpers/exec.ts";

try {
  await run(
    ["deno", "fmt", "--unstable", "--ignore=node_modules", ...Deno.args],
  );
} catch {
  Deno.exit(1);
}
