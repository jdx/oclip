import {oclip, arg} from 'oclip'

oclip({
  args: [arg('arg1'), arg.optional('arg2')],
  run({args}) {
    console.dir({args})
  }
}).parse()
