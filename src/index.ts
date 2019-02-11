import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { enviornment as env } from './environment';
import db from './models';
import { UserInstance } from './models/User';
import resolvers from './resolvers';
import typeDefs from './schema';

export interface Context {
  user?: UserInstance;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: env.apollo.introspection,
  playground: env.apollo.playground,
  context: async ({ req }: any) => {
    const token = req.headers.authorization || false;

    if (token) {
      const { id }: any = jwt.verify(token.substring(7), env.jwtSecret);

      const user = await db.User.findByPk(id);

      return { user };
    }
  },
});

server.listen(env.port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
