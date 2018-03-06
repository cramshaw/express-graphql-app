import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
var MyGraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`)

var root = {
  hello: () => {
    return 'Hello world!'
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  rootValue: root
}))

app.use('/graphiql', graphqlHTTP({
  schema: MyGraphQLSchema,
  rootValue: root,
  graphiql: true
}))

app.use('/', (req, res) => {
  res.send('Hello World')
})

app.listen(4000, () => {
  console.log('App listening on port 4000!')
})
