import { command } from "../mod.ts";
import { exec } from "./helpers/exec.ts";

export default command({
  async run() {
    try {
      await exec(["deno", "lint", "--unstable", "--ignore=node_modules"]);
      await exec(
        ["deno", "fmt", "--check", "--unstable", "--ignore=node_modules"],
      );
    } catch {
      Deno.exit(1);
    }
  },
  main: import.meta.main,
});
