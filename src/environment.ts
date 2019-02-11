const defaultPort = 4000;

declare var process: {
  env: {
    [key: string]: string;
  };
};

interface Environment {
  apollo: {
    introspection: boolean;
    playground: boolean;
  };
  db: {
    database: string;
    dialect: string;
    host: string;
    password: string;
    username: string;
  };
  jwtSecret: string;
  port: number | string;
}

export const enviornment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true',
  },
  db: {
    database: process.env.DB_DATABASE || 'budgeteer',
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    password: process.env.DB_PASSWORD || '',
    username: process.env.DB_USERNAME || 'root',
  },
  jwtSecret: process.env.JWT_SECRET || 'jwtSecret',
  port: process.env.PORT || defaultPort,
};
