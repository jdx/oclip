# oclip

![Node.js CI](https://github.com/oclif/oclip/workflows/Node.js%20CI/badge.svg)

This is a CLI flag parsing library. It's similar to [yargs](https://www.npmjs.com/package/yargs) in feature scope but written with a focus on TypeScript developers. Type Inference works very well in oclip and you won't have to manually specify types hardly ever.

The purpose for this project is two-fold: First to provide users that don't need a full fledged framework a simpler way to write TypeScript CLIs, and second to replace the original parser in [oclif](https://oclif.io/): [`@oclif/parser/`](https://github.com/oclif/parser).

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

command({
  args: [
    arg('ARG_ONE'),
    arg.optional('ARG_TWO'),
  ],
  run({args}) {
    const [argOne, argTwo] = args
    console.log(`argOne: ${argOne}`)
    console.log(`argTwo: ${argTwo}`)
  }
}).exec()
```

### Subcommands

Unlike oclif, oclip is designed for space-separated commands:

```typescript
import {command, topic, arg} from 'oclip'

topic({
  children: {
    auth: topic({
      children: {
        login: command({/*...*/})
        logout: command({/*...*/})
        token: command({/*...*/})
      }
    }),
    refresh: command({/*...*/})
  }
}).exec()
```

`command()` is just like we saw above. Topics allow us to add hierarchy and nest either subtopics or subcommands. We will not be supporting "topic-commands" (commands that are also a topic) like oclif does because it causes a lot of problem with space-separated commands—vs oclif's colon separated.

## TODO

- [ ] topic help listing
- [ ] normalized filepath arg/flag
- [ ] integer arg/flag
- [ ] env var arg/flag
- [ ] lazy-loading files via strings in topic files
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
