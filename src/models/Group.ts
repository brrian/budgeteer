import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { UserInstance, UserModel } from './User';

export interface GroupAttributes {
  id?: number;
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
