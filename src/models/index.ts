import Sequelize from 'sequelize';
import { enviornment as env } from '../environment';
import { BudgetFactory } from './Budget';
import { CategoriesFactory } from './Categories';
import { GroupFactory } from './Group';
import { SplitFactory } from './Split';
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
  Budget: BudgetFactory(sequelize, Sequelize),
  Categories: CategoriesFactory(sequelize, Sequelize),
  Group: GroupFactory(sequelize, Sequelize),
  Split: SplitFactory(sequelize, Sequelize),
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
