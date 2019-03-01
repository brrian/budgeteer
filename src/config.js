require('dotenv').config();

const database = process.env.DB_DATABASE || 'budgeteer';
const dialect = process.env.DB_DIALECT || 'mysql';
const host = process.env.DB_HOST || '127.0.0.1';
const password = process.env.DB_PASSWORD || '';
const username = process.env.DB_USERNAME || 'root';

module.exports = {
  development: { username, password, database, host, dialect },
  test: { username, password, database, host, dialect },
  production: { username, password, database, host, dialect },
};
