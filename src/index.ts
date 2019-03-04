import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { enviornment as env } from './environment';
import { scheduleJobs } from './jobs';
import schema from './schema';

export interface Context {
  userId: string;
  groupId: string;
}

const server = new ApolloServer({
  schema,
  introspection: env.apollo.introspection,
  playground: env.apollo.playground,
  context: async ({ req }: any) => {
    const authHeader: string = req.headers.authorization || false;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');

      return jwt.verify(token, env.jwtSecret);
    }
  },
});

server.listen(env.port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

scheduleJobs();

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
