
import { MongoClient } from 'mongodb';

// Connection URL
// const url = 'mongodb://mongodb:27017';
 
// Database Name
// const dbName = 'test';
 
// Use connect method to connect to the server
//MongoClient.connect(url)
//.then( (err, client) => {
//  console.log("Connected successfully to server");
// 
//  const db = client.db(dbName);
// 
//  client.close();
//});

const user = {
  username: 'cramshaw',
  password: 'password',
  token: 'atoken',
  id: 1
}

// The resolvers
const resolvers = {
  Query: {
    hello: async () => {
      // return await JSON.stringify( db.findOne() );
      return 'hello'
    },
    username: () => {
      return 'cramshaw'
    },
    user: () => user
  },
  Mutation: {
    login: (root, args) => {
      if (args.password === user.password) {
        return user
      } else {
        return {}
      }
    },
    easyLogin: (root, args) => {
      if (args.username === user.username) {
        return user
      } else {
        return {}
      }
    }
  }
}

export default resolvers
