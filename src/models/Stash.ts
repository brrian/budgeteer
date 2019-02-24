import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface StashAttributes {
  groupId: string;
  total: number;
  months: { [key: string]: number };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StashInstance
  extends Sequelize.Instance<StashAttributes>,
    StashAttributes {}

export interface StashModel
  extends Sequelize.Model<StashInstance, StashAttributes> {}

export const StashFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): StashModel => {
  const attributes: SequelizeAttributes<StashAttributes> = {
    groupId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    total: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    months: {
      allowNull: false,
      defaultValue: '{}',
      type: DataTypes.JSON,
      get(this: StashInstance) {
        const months = this.getDataValue('months');
        return typeof months === 'string' ? JSON.parse(months) : months;
      },
    },
  };

  const Stash = sequelize.define<StashInstance, StashAttributes>(
    'Stash',
    attributes,
    { freezeTableName: true }
  );

  return Stash;
};
