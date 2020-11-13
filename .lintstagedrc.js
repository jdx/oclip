// deno-lint-ignore no-undef
module.exports = {
  "**/*!(.ts|.js)": "prettier -w --ignore-unknown",
  "*.{js,ts,jsx,tsx}": ["prettier -w --ignore-unknown", "bin/fmt", "bin/lint"],
  "*.test.{js,ts}": ["bin/test"],
  "*/deps.ts": ["bin/cache_load"],
  ".husky/*": ["shellcheck -x"],
  "*": ["bin/gen_readme"],
};
