import { Command, flags, Flags } from 'prisma-cli-engine'
import * as express from 'express'
import chalk from 'chalk'
import * as opn from 'opn'
import { renderAdminPage } from 'prisma-admin-html'

export default class Admin extends Command {
  static topic = 'admin'
  static description = 'Open service endpoints in Prisma Admin'

  static flags: Flags = {
    'env-file': flags.string({
      description: 'Path to .env file to inject env vars',
      char: 'e',
    }),
    port: flags.number({
      char: 'p',
      description: 'Port to serve the Prisma Admin',
    }),
  }

  async run() {
    let { port } = this.flags

    if (!port) {
      port = 3000
    }

    const envFile = this.flags['env-file']
    await this.definition.load(this.flags, envFile)

    const serviceName = this.definition.service!
    const stage = this.definition.stage!

    const token = this.definition.getToken(serviceName, stage)

    const link = await this.startServer({
      endpoint: this.definition.endpoint,
      token,
      port,
    })

    opn(link).catch(() => {})
  }

  startServer = async ({ endpoint, token, port = 3000 }) =>
    new Promise(async (resolve, reject) => {
      const app = express()

      app.use('/admin', (req, res) => {
        res.send(renderAdminPage({ endpoint, token }))
      })

      const listener = app.listen(port, () => {
        let host = listener.address().address
        if (host === '::') {
          host = 'localhost'
        }
        const link = `http://${host}:${port}/admin`
        console.log('Serving admin at %s', chalk.blue(link))

        resolve(link)
      })
    })
}
