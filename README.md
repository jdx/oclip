# oclip

![Node.js CI](https://github.com/oclif/oclip/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/oclif/oclip/branch/master/graph/badge.svg)](https://codecov.io/gh/oclif/oclip)

oclip is a new Node CLI flag parser. It has the following killer features of which not a single one can be found in another popular CLI parser.

* **lazy-loading** commands out of the box means oclip will have the lowest overhead possible. This becomes paramount as CLIs grow.
* **type inference** TypeScript is not required, but when it is used oclip will be able to infer all the details about flags and args. You'll rarely ever have to specify types manually.
* **0 dependencies** You don't need a single runtime or even development dependency other than `oclip` itself. Currently oclip only [costs ~10kB](https://bundlephobia.com/result?p=oclip@0.0.3).

_Feel free to play around with this code all you like but anticipate heavily breaking changes until we release 1.x._

## Quick Start

In a new or existing node project, first add oclip: `npm i oclip` or `yarn add oclip`. Then create a basic hello, world CLI:

```typescript
// typescript
import {command} from 'oclip'
// javascript
const {command} = require('oclip')

command({
  run() {
    console.log('hello world!')
  }
}).exec()
```

> Note: You can also clone the [example template](https://github.com/oclif/oclip-example)

Run this with `node path/to/script` (for JS) or `ts-node path/to/script` (for TS). `command()` creates a command and calling `.exec()` on it causes it to read `process.argv`, parse the args/flags, and pass them to the command.

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

If you run this script with `--help` you'll see the following:

```sh-session
$ ts-node src/cli.ts --help
Usage: mycli <ARG_ONE> [<ARG_TWO>]
```

[See below for more argument functionality](#arguments).

### Parsing Flags

```typescript
import {command, flag} from 'oclip'

// $ mycli --verbose --file=FILENAME
// TypeScript is able to infer that `verbose` is a boolean and `file` is a string.
command({
  flags: {
    // -v for a short char and help description
    verbose: flag.boolean('v', 'show extra output'),
    file: flag.input('f', 'file to read from')
  },
  run({flags: {verbose, file}}) {
    console.log(`verbose: ${verbose}`)
    console.log(`file: ${file}`)
  }
}).exec()
```

If you run this script with `--help` you'll see the following:

```sh-session
$ ts-node src/cli.ts --help
Usage: mycli

Options:
  -v, --verbose     # show extra output
  -f, --file        # file to read from
```

[See below for more flag functionality](#flags).

## Background

oclip is the result of years of development on the Heroku CLI, then [oclif](https://oclif.io)—the framework extracted from the Heroku CLI. Unlike those projects, the goal of this project is not to be a platform for a specific CLI but to offer the best CLI experience in Node possible. [See below for more on the differences between this and oclif](#faqs).

oclif was very close but some of the opinions it made were not suitable for everyone and would be too difficult to change while supporting the (now) loads of CLIs depending on that behavior.

We plan on using oclip inside of oclif to replace its parser and improve oclif's type inference.

## Project Scope

Main goals:

* To be the tool of choice for the Node community's CLIs in TS and JS
* Option/flag parsing in the GNU style
* Powerful args/flags functionality that can be extended for resuable custom behavior/types
* Subcommand dispatching with lazy-loading
* In-CLI help output
* Completions for bash/zsh/fish
* Man-page CLI doc generation
* Never requiring a dependency, internal or external
* Doing whatever we can to make TypeScript inference and types as helpful as possible
* Providing configuration support
* Middleware hooks

Anti-goals include:

* plugin support—this is oclif's domain
* loading commands from a directory—again: oclif
* project generators—if we need that then we're doing something too complex
* repls—like [vorpal](https://www.npmjs.com/package/vorpal)
* Building this in another language
* Anything involving classes, decorators, or any other kind of alternate syntaxes. We need to support the ability to be flexible, but the way things are done must be consistent
* Doing really anything after the command starts

## Arguments

## Flags

## Subcommands/Subtopics

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

## Running Commands Programmatically

The `.exec()` method on a command/topic are simply functions that return a promise. By default, they will use `process.argv` as their input, but this can be modified.

As an example:

```typescript
const cmd = command({
  flags: { verbose: flag.boolean('v') },
  run: async ({flags}) => {
    return flags.verbose
  }
})
const p = cmd.exec(['-v']) // p is a promise that evaluates to true
const q = cmd.exec([])     // q is a promise that evaluates to false
```

## Testing

The `.exec()` method on a command/topic are simply functions that return a promise. By default, they will use `process.argv` as their input, but this can be modified. Usually you'll want to do this when writing a test or calling a command from another command. Here is a Jest test example:

```typescript
test('--verbose', async () => {
  await command({
    flags: { verbose: flag.boolean('v') },
    run: ({flags}) => {
      expect(flags).toMatchObject({verbose: true})
    }
  }).exec(['-v'])
})
```

If it errors it will reject the promise it returns:

```typescript
test('errors if flag is not valid', async () => {
  const cmd = command({
    flags: { verbose: flag.boolean('v') },
    run: ({flags}) => {
      expect(flags).toMatchObject({verbose: true})
    }
  })
  await expect(cmd.exec(['--invalid-flag']))
    .rejects.toThrowError(/Unexpected argument: --invalid-flag/)
})
```

Use [`stdout-stderr`](https://github.com/jdxcode/stdout-stderr) if you want to check output:

```typescript
import {stdout} from 'stdout-stderr'

test('prints to stdout', async () => {
  stdout.start()
  await command({
    run: () => console.log('sample text')
  }).exec([])
  stdout.stop()
  expect(stdout.output).toEqual('sample text\n')
})
```

## FAQs

### What's the difference between this and oclif?

oclif is a full-fledged CLI framework that will soon be using oclip under the hood. In particular, the [plugin functionality](https://oclif.io/docs/plugins) lets users add plugins to extend functionality. oclif is an opinionated framework that requires you to follow its conventions for how commands are organized.

oclip is a much simpler project. It was built to take advantage of newer parts of TypeScript so it has better type inference than oclif's classes. It makes no opinions of structure and does not require a generator to build a project.

Both oclif and oclip are built for speed. They both support lazy-loading commands which is something no other Node CLI parser offers and crucial for medium–large CLIs. oclif only has a handful of dependencies and oclip has exactly 0.

As a departure from oclif, oclip will support space-separated arguments. Later we plan to add colon-separated arguments like in oclif.

Use oclif if:

* You want plugins
* You want commands represented as classes
* You want colon-separated arguments
* You prefer an opinionated setup

Use oclip if:

* You want things to be simple (oclip has 0 dependencies)
* You need more control for things like dynamically generated commands
* You want space-separated arguments
* You want the best type inference available for TypeScript CLIs

### Can I convert from oclif to oclip?

Short answer is no. oclip will never reach feature parity with oclif—chiefly plugins.

For consistency we'd like oclif to use oclip under the hood. This is a change that will be opt-in as the parser is completely modular in oclif and even now can be swapped out for anything. So the improved type inference will at some point come to oclif.

If you currently have an oclif CLI and want some of the functionality of oclip (like dynamic commands, for example), you're going to have to manually rewrite all the commands. It might also be possible to craft a base class that uses oclip.

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
- [ ] js example
- [ ] "did you mean?"
- [ ] config support
- [ ] onload middleware
- [ ] onparse middleware
- [ ] onerror middleware
- [ ] onexit middleware
- [ ] override CLI bin name
