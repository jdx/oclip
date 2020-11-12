import { command } from "../mod.ts";
import { commandHelp } from "./help.ts";
import { assertEquals } from "../test/deps.ts";

Deno.test("empty command help", () => {
  const help = commandHelp(command({
    run() {},
  }));
  assertEquals(
    help,
    `Usage: USAGE
`,
  );
});
