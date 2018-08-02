import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { ApolloServer, gql } from 'apollo-server-express'
// import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient } from 'mongodb';
import resolvers from './resolvers'


// The GraphQL schema in string form
const typeDefs = `
  type Test {
    test: String
  }

  type Query {
    hello: Test
    username: String
    user: User
  }

  type User {
    username: String,
    password: String,
    token: String
    id: ID
  }

  type Mutation {
    login(username: String!, password: String!): User
    easyLogin(username: String!): User
  }
`
// Put together a schema
// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// })

const schema = "Hello World";

// Connection String
const url = 'mongodb://mongodb:27017';
// Database Name
const dbName = 'test';
// Use connect method to connect to the server
const client = MongoClient.connect(url)

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ request, h }) => {
    // Connection URL
    return {
      db: (await client).db(dbName)
    };
  },
})

// Initialize the app
const app = express()

server.applyMiddleware({ app });

// app.use(cors())

app.use(function (req, res, next) {
  console.log(req.ip + ' ' + req.url)
  next()
})

// // The GraphQL endpoint
// app.use('/graphql',
//   bodyParser.json(),
//   graphqlExpress({
//     schema
//   }))

// // GraphiQL, a visual editor for queries
// app.use('/graphiql',
//   graphiqlExpress({
//     endpointURL: '/graphql'
//   }))

app.use('/', (req, res, next) => {
  res.send(schema)
})

// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!')
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)

})
