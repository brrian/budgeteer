import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface CategoriesAttributes {
  id?: number;
  groupId: number;
  categories: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoriesInstance
  extends Sequelize.Instance<CategoriesAttributes>,
    CategoriesAttributes {}

export interface CategoriesModel
  extends Sequelize.Model<CategoriesInstance, CategoriesAttributes> {}

export const CategoriesFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): CategoriesModel => {
  const attributes: SequelizeAttributes<CategoriesAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    groupId: {
      type: DataTypes.STRING,
    },
    categories: {
      type: DataTypes.JSON,
    },
  };

  const Categories = sequelize.define<CategoriesInstance, CategoriesAttributes>(
    'Categories',
    attributes
  );

  return Categories;
};
