import {oclip, arg, flag} from 'oclip'

oclip({
  children: {
    serve: oclip({
      args: [arg('port')],
      flags: {verbose: flag.bool()},
      run({args: [port], flags}) {
        console.dir({type: 'serve', port, flags})
      }
    }),
    kill: oclip({
      args: [arg('port')],
      flags: {verbose: flag.bool()},
      run({args: [port], flags}) {
        console.dir({type: 'kill', port, flags})
      }
    })
  },
}).exec()
