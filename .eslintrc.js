const eslint = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2020,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {}
}

const error = (id, ...extra) => eslint.rules[id] = ['error', ...extra]
const warn = (id, ...extra) => eslint.rules[id] = ['warn', ...extra]
const off = (id, ...extra) => eslint.rules[id] = ['off', ...extra]

error('semi', 'never')
error('quotes', 'single')
error('indent', 2)
warn('@typescript-eslint/no-unused-vars')
off('no-unused-vars')

module.exports = eslint
