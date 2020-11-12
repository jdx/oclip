export async function run(cmd: string[]) {
  const p = Deno.run({ cmd });
  const status = await p.status();
  throwIfError(cmd, status);
}

export async function stdout(cmd: string[]): Promise<string> {
  const p = Deno.run({
    cmd,
    stdout: "piped",
    env: { NO_COLOR: "1" },
  });
  const status = await p.status();
  throwIfError(cmd, status);

  return new TextDecoder().decode(await p.output());
}

function throwIfError(cmd: string[], status: Deno.ProcessStatus) {
  if (status.success) return;
  throw new Error(`${cmd.join(" ")} exited with code: ${status.code}`);
}
