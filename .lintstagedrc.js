module.exports = {
  '*.{js,ts,json}': ['eslint --fix', 'prettier -w'],
  '*.{yaml,yml}': ['prettier -w'],
};
