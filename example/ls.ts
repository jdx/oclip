#!/usr/bin/env -S deno run --allow-read

const [dir = "."] = Deno.args;

// gather all the filenames
const files = [];
for await (const file of Deno.readDir(dir)) {
  files.push(file);
}
files.sort();

// output the data
console.log(`${files.length} files in ${dir}:`);
for (const file of files) {
  console.log("* " + file.name);
}
