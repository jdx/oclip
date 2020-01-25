import oclip, {arg} from '.'

oclip({
  args: [
    arg('foo'),
    arg('oo'),
    arg('bar'),
    arg('dslkfj', {parse: a => a.repeat(4).length})
  ]
}).run(({args, flags}) => {
  console.dir(args)
})
