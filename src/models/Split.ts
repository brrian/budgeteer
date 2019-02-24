import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface SplitAttributes {
  id?: string;
  transactionId: string;
  description: string;
  note?: string;
  categoryId: number;
  amount: number;
  disabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SplitInstance
  extends Sequelize.Instance<SplitAttributes>,
    SplitAttributes {}

export interface SplitModel
  extends Sequelize.Model<SplitInstance, SplitAttributes> {}

export const SplitFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): SplitModel => {
  const attributes: SequelizeAttributes<SplitAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    transactionId: {
      allowNull: false,
      type: DataTypes.UUIDV4,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.TEXT,
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    amount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    disabled: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  };

  const Split = sequelize.define<SplitInstance, SplitAttributes>(
    'Split',
    attributes
  );

  return Split;
};
