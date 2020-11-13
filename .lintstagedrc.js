// deno-lint-ignore no-undef
module.exports = {
  "**/*": "prettier -w --ignore-unknown",
  "*.{js,ts,jsx,tsx}": ["bin/fmt", "bin/lint"],
  "*.test.{js,ts}": ["bin/test"],
  "*/deps.ts": ["bin/cache_load"],
  "*": ["bin/gen_readme"],
};
