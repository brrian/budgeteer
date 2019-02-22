import Sequelize from 'sequelize';
import { enviornment as env } from '../environment';
import { CategoriesFactory } from './Categories';
import { GroupFactory } from './Group';
import { StashFactory } from './Stash';
import { TransactionFactory } from './Transaction';
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
  Categories: CategoriesFactory(sequelize, Sequelize),
  Group: GroupFactory(sequelize, Sequelize),
  Stash: StashFactory(sequelize, Sequelize),
  Transaction: TransactionFactory(sequelize, Sequelize),
  User: UserFactory(sequelize, Sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
