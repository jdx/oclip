import { command } from "../mod.ts";
import { exec } from "./helpers/exec.ts";

export default command({
  async run() {
    try {
      await exec(
        ["deno", "fmt", "--unstable", "--ignore=node_modules", ...Deno.args],
      );
    } catch {
      Deno.exit(1);
    }
  },
  main: import.meta.main,
});
