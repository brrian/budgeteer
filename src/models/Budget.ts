import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface BudgetAttributes {
  id: string;
  groupId: string;
  total: number;
  categories: Array<{
    id: number;
    limit: number;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetInstance
  extends Sequelize.Instance<BudgetAttributes>,
    BudgetAttributes {}

export interface BudgetModel
  extends Sequelize.Model<BudgetInstance, BudgetAttributes> {}

export const BudgetFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): BudgetModel => {
  const attributes: SequelizeAttributes<BudgetAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    groupId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    total: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    categories: {
      allowNull: false,
      defaultValue: '{}',
      type: DataTypes.JSON,
      get(this: BudgetInstance) {
        const categories = this.getDataValue('categories');
        return typeof categories === 'string'
          ? JSON.parse(categories)
          : categories;
      },
    },
  };

  const Budget = sequelize.define<BudgetInstance, BudgetAttributes>(
    'Budget',
    attributes
  );

  return Budget;
};
