#!/usr/bin/env ts-node

/**
 * Dependencies
 */
import { isError, HelpError, Env } from '@prisma/cli'
import {
  LiftCommand,
  LiftCreate,
  LiftUp,
  LiftDown,
  LiftWatch,
} from '@prisma/lift'
import { CLI } from './CLI'
import { PhotonGenerate } from '@prisma/photon'

/**
 * Main function
 */
async function main(): Promise<number> {
  // load the environment
  const env = await Env.load(process.env, process.cwd())
  if (isError(env)) {
    console.error(env)
    return 1
  }
  // create a new CLI with our subcommands
  const cli = CLI.new({
    lift: LiftCommand.new(
      {
        create: LiftCreate.new(env),
        up: LiftUp.new(env),
        down: LiftDown.new(env),
      },
      env,
    ),
    dev: LiftWatch.new(env, {
      afterUp: () => {
        PhotonGenerate.new(env).parse([], true)
      },
    }),
    generate: PhotonGenerate.new(env),
  })
  // parse the arguments
  var result = await cli.parse(process.argv.slice(2))
  if (result instanceof HelpError) {
    console.error(result.message)
    return 1
  } else if (isError(result)) {
    console.error(result)
    return 1
  }
  console.log(result)

  return 0
}
/**
 * Run our program
 */
main()
  .then(code => {
    if (code !== 0) {
      process.exit(code)
    }
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
