import {oclip, arg} from 'oclip'

oclip({
  args: [arg('ARG_1'), arg.optional('ARG_2')],
  run({args}) {
    console.dir({args})
  }
}).exec()
