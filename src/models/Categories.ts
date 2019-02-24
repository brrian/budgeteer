import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface CategoriesAttributes {
  id?: string;
  groupId: string;
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
      get(this: CategoriesInstance) {
        const categories = this.getDataValue('categories');

        return typeof categories === 'string'
          ? JSON.parse(categories)
          : categories;
      },
    },
  };

  const Categories = sequelize.define<CategoriesInstance, CategoriesAttributes>(
    'Categories',
    attributes
  );

  return Categories;
};
