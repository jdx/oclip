import { exec } from "./helpers/exec.ts";

try {
  await exec(["deno", "lint", "--unstable", "--ignore=node_modules"]);
  await exec(["deno", "fmt", "--check", "--unstable", "--ignore=node_modules"]);
} catch {
  Deno.exit(1);
}
