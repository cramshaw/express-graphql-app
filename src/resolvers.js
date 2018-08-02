const user = {
  username: 'cramshaw',
  password: 'password',
  token: 'atoken',
  id: 1
}

// The resolvers
const resolvers = {
  Query: {
    hello: (parent, _, context) => {
      return context.db.collection('test').findOne()
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
