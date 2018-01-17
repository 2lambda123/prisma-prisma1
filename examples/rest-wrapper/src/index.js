const { GraphQLServer } = require('graphql-yoga')
const { resolvers } = require('./dog-api/resolvers')
const { Prisma } = require('prisma-binding')

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: true,
    }),
  }),
})

server.start(({ port }) => console.log(`Server is running on http://localhost:${port}`))
