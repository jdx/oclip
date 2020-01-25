import {oclip, arg, flag} from 'oclip'

oclip({
  subcommands: {
    serve: oclip({
      args: [arg('port')],
      flags: {verbose: flag.bool()},
      run({args: {port}, flags}) {
        console.dir({port, flags})
      }
    })
  },
  args: [arg('ARG_1'), arg.optional('ARG_2')],
  run({args}) {
    console.dir({args})
  }
}).exec()
