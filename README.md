# oclip

![Node.js CI](https://github.com/oclif/oclip/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/oclif/oclip/branch/master/graph/badge.svg)](https://codecov.io/gh/oclif/oclip)

This is a CLI flag parsing library. It's similar to [yargs](https://www.npmjs.com/package/yargs) in feature scope but written with a focus on TypeScript developers. Type Inference works very well in oclip and you won't have to manually specify types hardly ever.

The purpose for this project is two-fold: First to provide users that don't need a full fledged framework a simpler way to write TypeScript CLIs, and second to replace the original parser in [oclif](https://oclif.io/): [`@oclif/parser`](https://github.com/oclif/parser).

This will have much more functionality than the current parser. It will include support for topics and subcommands so you can use it standalone for even reasonably complex CLIs. This overlaps with oclif a bit but I feel that's ok.

_Feel free to play around with this code all you like but anticipate heavily breaking changes until we release 1.x._

## Getting Started

In a new or existing node project, first add oclip: `npm i oclip` or `yarn add oclip`. Then create a basic hello, world CLI:

```typescript
import {command} from 'oclip'

command({
  run() {
    console.log('hello world!')
  }
}).exec()
```

Run it with `node path/to/script` or `ts-node path/to/script`. `command()` creates a command and calling `.exec()` on it causes it to read `process.argv` and run it command. You can specify alternate arguments by passing them into parse: `.parse(['some', 'custom', 'arguments'])`.

### Parsing Arguments

Arguments are required by default, use `.optional()` to make them optional:

```typescript
import {command, arg} from 'oclip'

// $ mycli argOne argTwo
command({
  args: [
    arg('ARG_ONE'),
    arg.optional('ARG_TWO'),
  ],
  run({args: [argOne, argTwo]}) {
    console.log(`argOne: ${argOne}`)
    console.log(`argTwo: ${argTwo}`)
  }
}).exec()
```

### Parsing Flags

```typescript
import {command, flag} from 'oclip'

// $ mycli --verbose --file=FILENAME
// TypeScript is able to infer that `verbose` is a boolean and `file` is a string.
command({
  flags: {
    // -v for a short char and help description
    verbose: flag.boolean('v', 'show extra output'),
    file: file.input('f', 'file to read from')
  },
  run({flags: {verbose, file}}) {
    console.log(`verbose: ${verbose}`)
    console.log(`file: ${file}`)
  }
}).exec()
```

### Subcommands/Subtopics

Break up your CLI into separate commands:

```typescript
import {command, topic, arg} from 'oclip'

// run these with `$ mycli login` or `$ mycli refresh`
topic({
  children: {
    login: command({/*...*/}),
    refresh: command({/*...*/}),
  }
}).exec()
```

Or you can also have subtopics which can sit next to commands:

```typescript
import {command, topic, arg} from 'oclip'

// run these with `$ mycli auth login` or `$ mycli auth token get`
topic({
  children: {
    auth: topic({
      children: {
        login: command({/*...*/}),
        logout: command({/*...*/}),
        token: topic({
          get: command({/*...*/}),
          reset: command({/*...*/}),
        })
      }
    }),
  }
}).exec()
```

> Note: We will not be supporting "topic-commands" (commands that are also a topic) like oclif does because it is not compatible with space-separated commands.

## TODO

- [x] topic help listing
- [ ] normalized filepath arg/flag
- [ ] integer arg/flag
- [ ] env var arg/flag
- [x] lazy-loading files via strings in topic files
- [ ] manifest file to help with ^^ and make help fast
- [ ] help examples
- [ ] `mycli help foo`
- [ ] `--`
- [ ] style errors
- [ ] hooks/middleware?
- [ ] oclif integration
- [ ] global flags
- [ ] completions
- [ ] grouping in help
- [ ] countable booleans (e.g.: -vvv)
