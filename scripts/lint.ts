import { run } from "../lib/exec.ts";

try {
  console.log('hello world');
  await run(["echo", "lint", "--unstable", "--ignore=node_modules"]);
  // await run(["deno", "lint", "--unstable", "--ignore=node_modules"]);
  // await run(["deno", "fmt", "--check", "--unstable", "--ignore=node_modules" ]);
} catch {
  Deno.exit(1);
}
