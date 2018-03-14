import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

// The GraphQL schema in string form
const typeDefs = `
  type Query {
    hello: String
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
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// Initialize the app
const app = express()

app.use(cors())

app.use(function (req, res, next) {
  console.log(req.ip + ' ' + req.url)
  next()
})

// The GraphQL endpoint
app.use('/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema
  }))

// GraphiQL, a visual editor for queries
app.use('/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  }))

app.use('/', (req, res, next) => {
  res.send(schema)
})

// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!')
})
