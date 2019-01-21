import { test } from 'ava'
import { Client } from './Client'
import { Model } from './types'
import { print } from 'graphql'

test('automatic non-scalar sub selection for a connection without scalars', t => {
  const typeDefs = `
    type Query {
      usersConnection(where: UserWhereInput): UserConnection
    }

    input UserWhereInput {
      id: ID!
    }

    type UserConnection {
      pageInfo: PageInfo!
      edges: [UserEdge]!
      aggregate: AggregateUser!
    }

    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: String
      endCursor: String
    }

    type UserEdge {
      node: User!
      cursor: String!
    }

    type AggregateUser {
      count: Int!
    }
    
    type House {
      id: ID!
      name: String!
      user: User!
    }

    type User {
      house: House!
    }
  `

  const models: Model[] = []

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.usersConnection()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('automatic non-scalar sub selection for a connection with scalars', t => {
  const typeDefs = `
    type Query {
      housesConnection(where: HouseWhereInput): HouseConnection
    }

    input HouseWhereInput {
      id: ID!
    }

    type HouseConnection {
      pageInfo: PageInfo!
      edges: [HouseEdge]!
      aggregate: AggregateHouse!
    }

    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: String
      endCursor: String
    }

    type HouseEdge {
      node: House!
      cursor: String!
    }

    type AggregateHouse {
      count: Int!
    }
    
    type House {
      id: ID!
      name: String!
      user: User!
    }

    type User {
      house: House!
    }
  `

  const models: Model[] = []

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.housesConnection()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('automatic non-scalar sub selection for relation', t => {
  const typeDefs = `
    type Query {
      house(where: HouseWhereInput): House
    }

    input HouseWhereInput {
      id: ID!
    }

    type User {
      house: House!
    }
    
    type House {
      id: ID!
      name: String!
      user: User!
    }
  `

  const models: Model[] = []

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.house({
    id: "id"
  }).user()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('automatic non-scalar sub selection', t => {
  const typeDefs = `
    type Query {
      users(where: UserWhereInput): [User]
    }

    input UserWhereInput {
      id: ID!
    }

    type User {
      house: House!
    }
    
    type House {
      id: ID!
      name: String!
    }
  `

  const models: Model[] = []

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.users()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('related type', t => {
  const typeDefs = `
    type Query {
      user: User
    }

    type User {
      id: ID!
      posts: [Post!]!
    }

    type Post {
      content: String!
    }
  `

  const models: Model[] = [
    {
      embedded: false,
      name: 'User',
    },
    {
      embedded: false,
      name: 'Post',
    },
  ]

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.user()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('deep related type', t => {
  const typeDefs = `
    type Query {
      user: User
    }

    type User {
      id: ID!
      posts: [Post!]!
    }

    type Post {
      content: String!
    }
  `

  const models: Model[] = [
    {
      embedded: false,
      name: 'User',
    },
    {
      embedded: false,
      name: 'Post',
    },
  ]

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.user().posts()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('embedded type', t => {
  const typeDefs = `
    type Query {
      user: User
    }

    type User {
      id: ID!
      posts: [Post!]!
    }

    type Post {
      content: String!
    }
  `

  const models: Model[] = [
    {
      embedded: false,
      name: 'User',
    },
    {
      embedded: true,
      name: 'Post',
    },
  ]

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.user()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('nested mbedded type', t => {
  const typeDefs = `
    type Query {
      user: User
    }

    type User {
      id: ID!
      posts: [Post!]!
    }

    type Post {
      content: String!
      meta: PostMeta
    }

    type PostMeta {
      meta: String!
    }
  `

  const models: Model[] = [
    {
      embedded: false,
      name: 'User',
    },
    {
      embedded: true,
      name: 'Post',
    },
    {
      embedded: true,
      name: 'PostMeta',
    },
  ]

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.user()

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('top level args', t => {
  const typeDefs = `
    type Query {
      post(where: PostInput!): Post
    }

    input PostInput {
      id: ID!
    }

    type Post {
      id: ID!
      title: String!
      content: String!
    }
  `

  const models: Model[] = [
    {
      embedded: false,
      name: 'Post',
    },
  ]

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.post({ id: 'test' })

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})

test('nested args', t => {
  const typeDefs = `
    type Query {
      user: User
      post(where: PostInput!): Post
    }

    input PostInput {
      author: AuthorInput!
    }

    input AuthorInput {
      firstName: String!
      lastName: String!
    }

    type User {
      id: ID!
      post: Post
    }

    type Post {
      id: ID!
      title: String!
      content: String!
      user: User
    }
  `

  const models: Model[] = [
    {
      embedded: false,
      name: 'User',
    },
    {
      embedded: false,
      name: 'Post',
    },
  ]

  const endpoint = 'http://localhost:4466'

  const client: any = new Client({
    typeDefs,
    endpoint,
    models,
  })

  client.post({
    author: {
      firstName: 'Lydia',
      lastName: 'Hallie',
    },
  })

  const document = client.getDocumentForInstructions(
    Object.keys(client._currentInstructions)[0],
  )

  t.snapshot(print(document))
})
