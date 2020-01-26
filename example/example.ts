import {topic, command, arg, flag} from 'oclip'

topic({
  children: {
    serve: command({
      args: [
        arg('port'),
        arg.optional('filename'),
      ],
      flags: {verbose: flag.boolean()},
      run({args: [port], flags}) {
        console.dir({type: 'serve', port, flags})
      }
    }),
    kill: command({
      args: [arg('port')],
      flags: {verbose: flag.boolean()},
      run({args: [port], flags}) {
        console.dir({type: 'kill', port, flags})
      }
    })
  },
}).exec()
