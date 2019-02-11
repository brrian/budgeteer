require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
const resolvers = require('./data/resolvers');
const typeDefs = require('./data/typeDefs');

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || false;

    if (token) {
      const { id } = jwt.verify(token.substring(7), process.env.JWT_SECRET);

      const user = await User.findByPk(id);

      return { user };
    }
  },
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
