import { PubSub } from "apollo-server-express";

const pubsub = new PubSub();

const LOAD_COMPLETE = 'LOAD_COMPLETE'

const MONGO_COLLECTION = 'test'

const user = {
  username: 'cramshaw',
  password: 'password',
  token: 'atoken',
  id: 1
}

// The resolvers
const resolvers = {
  Subscription: {
    loadComplete: {
      subscribe: () => pubsub.asyncIterator([ LOAD_COMPLETE ])
    }
  },
  Query: {
    hello: (parent, _, context) => {
      return context.db.collection(MONGO_COLLECTION).findOne()
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
    },
    loadData: async (root, args, context) => {
      // console.log( "BLAH  ",  await context.db.collection(MONGO_COLLECTION).insert( { "user": args.user, "status": args.status } ) , "     BLAH  " )
      // console.log( await context.db.collection(MONGO_COLLECTION).insert( { "user": args.user, "status": args.status } ) )
      // pubsub.publish(LOAD_COMPLETE, { "user": args.user, "status": args.status } );
      pubsub.publish(LOAD_COMPLETE,
        {
          loadComplete : `user ${i}`
        }
      );
      return context.db.collection(MONGO_COLLECTION).insert( { "user": args.user, "status": args.status } )
    }
  }
}

var i = 1;
setInterval(() => {
  pubsub.publish(LOAD_COMPLETE,
    {
      loadComplete : `user ${i}`
    }
  );
  i++;
}, 1000);

export default resolvers
