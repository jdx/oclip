import { command } from "../mod.ts";
import { stdout } from "./helpers/exec.ts";

const cmd = command({
  async run() {
    async function apiDocumentation(): Promise<string> {
      const doc = await stdout(["deno", "doc", "mod.ts"]);
      return [
        "```",
        doc,
        "```",
      ].join("\n");
    }

    const contents = [
      "# oclip",
      "",
      "## API Documentation",
      "",
      await apiDocumentation(),
      "Made by Jeff Dickey",
      "",
    ];

    await Deno.writeTextFile("README.md", contents.join("\n"));
  },
  main: import.meta.main,
});
