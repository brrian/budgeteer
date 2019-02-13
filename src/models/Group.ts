import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { UserInstance, UserModel } from './User';

export interface GroupAttributes {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GroupInstance
  extends Sequelize.Instance<GroupAttributes>,
    GroupAttributes {
  getUsers: Sequelize.HasManyGetAssociationsMixin<UserInstance>;
}

export interface GroupModel
  extends Sequelize.Model<GroupInstance, GroupAttributes> {}

export const GroupFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): GroupModel => {
  const attributes: SequelizeAttributes<GroupAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
  };

  const Group = sequelize.define<GroupInstance, GroupAttributes>(
    'Group',
    attributes
  );

  Group.associate = ({ User }: { User: UserModel }) => {
    Group.hasMany(User);
  };

  return Group;
};
