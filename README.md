# oclip

![Node.js CI](https://github.com/oclif/oclip/workflows/Node.js%20CI/badge.svg)

This is a CLI flag parsing library. It's similar to [yargs](https://www.npmjs.com/package/yargs) in feature scope but written with a focus on TypeScript.

It's designed as a replacement for the initial parser in [oclif](https://oclif.io/). Use this library if you want a simple parser and use oclif if you want a fully fledged CLI framework.

_This under heavy WIP._

## Getting Started

In a new or existing node project, first add oclip: `npm i oclip` or `yarn add oclip`. Then create a basic hello, world CLI:

```typescript
import {oclip} from 'oclip'

oclip({
  run() {
    console.log('hello world!')
  }
}).parse()
```

Run it with `node path/to/script` or `ts-node path/to/script`. `oclip()` creates a command and calling `.parse()` on it causes it to read `process.argv` and run the command. You can specify alternate arguments by passing them into parse: `.parse(['some', 'custom', 'arguments'])`.

### Parsing Arguments

Arguments are required by default:

```typescript
import {oclip, arg} from 'oclip'

oclip({
  args: [
    arg('ARG_ONE'),
    arg.optional('ARG_TWO'),
  ],
  run({args}) {
    const [argOne, argTwo] = args
    console.log(`argOne: ${argOne}`)
    console.log(`argTwo: ${argTwo}`)
  }
}).parse()
```
