import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { createServer } from 'http';

// import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { ApolloServer, gql } from 'apollo-server-express'
// import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient } from 'mongodb';
import resolvers from './resolvers'

import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { makeExecutableSchema } from 'graphql-tools';
import { introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server-express';

const DATA_URI = "http://172.27.19.23:8000/graphql/"
// const DATA_URI = "https://api.graphcms.com/simple/v1/swapi"

async function run() {

  const link = new HttpLink({ uri: DATA_URI, fetch });

  const introspectedSchema = await introspectSchema(link);

  const dataSchema = makeRemoteExecutableSchema({
    schema: introspectedSchema,
    link,
  })

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

    type inserted {
      insertedCount: Int
    }

    type Subscription {
      loadComplete: User
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
      loadData(user: String!, status: Int!): inserted
    }
  `
  // Put together a schema
  // const schema = makeExecutableSchema({
  //   typeDefs,
  //   resolvers
  // })

  const mongoSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const schema = "Hello World";

  // Connection String
  const url = `mongodb://${process.env.MONGO_HOST || 'localhost'}:27017`;
  // Database Name
  const dbName = 'test';
  // Use connect method to connect to the server
  const client = MongoClient.connect(url, { useNewUrlParser: true })

  const mergedSchema = mergeSchemas({
    schemas: [
      dataSchema,
      mongoSchema,
    ]
  })

  // Apollo Server
  const server = new ApolloServer({
    schema: mergedSchema,
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

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // app.use(cors())

  // app.use(function (req, res, next) {
  //   console.log(req.ip + ' ' + req.url)
  //   next()
  // })

  // // // The GraphQL endpoint
  // // app.use('/graphql',
  // //   bodyParser.json(),
  // //   graphqlExpress({
  // //     schema
  // //   }))

  // // // GraphiQL, a visual editor for queries
  // // app.use('/graphiql',
  // //   graphiqlExpress({
  // //     endpointURL: '/graphql'
  // //   }))

  app.use('/', (req, res, next) => {
    res.send(introspectedSchema)
  })

  // Start the server
  httpServer.listen(4000, () => {
    // console.log('Go to http://localhost:4000/graphiql to run queries!')
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)

  })
}

run()
.catch(err => {
         // handle rejection here
         console.log(err)
      });;