import Oclip, {arg} from 'oclip'

class Version extends Oclip {
  async run() {}
}

class MyCLI extends Oclip {
  static subcommands = {
    'version': Version,
  }

  @arg()
  arg1!: string

  @arg.optional('mydesc2')
  arg2?: string

  @arg.rest()
  restargs!: string[]

  async run() {
    console.log('running MyCLI' + this.arg1)
    return {exitCode: 100}
  }
}

Oclip.run(MyCLI)
