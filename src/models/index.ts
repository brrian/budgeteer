import Sequelize from 'sequelize';
import { enviornment as env } from '../environment';
import { GroupFactory } from './Group';
import { UserFactory } from './User';

const sequelize = new Sequelize(
  env.db.database,
  env.db.username,
  env.db.password,
  env.db
);

const db = {
  sequelize,
  Sequelize,
  Group: GroupFactory(sequelize, Sequelize),
  User: UserFactory(sequelize, Sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
