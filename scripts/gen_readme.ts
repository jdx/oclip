#!/usr/bin/env deno run --allow-write --allow-run

import { stdout } from "../lib/exec.ts";

async function apiDocumentation(): Promise<string> {
  const doc = await stdout(["deno", "doc", "crane.ts"]);
  return [
    "```",
    doc,
    "```",
  ].join("\n");
}

const contents = [
  "# crane",
  "",
  "## API Documentation",
  "",
  await apiDocumentation(),
  "Made by Jeff Dickey",
  "",
];

await Deno.writeTextFile("README.md", contents.join("\n"));