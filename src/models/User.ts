import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { GroupInstance, GroupModel } from './Group';

export interface UserAttributes {
  id?: string;
  groupId: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance
  extends Sequelize.Instance<UserAttributes>,
    UserAttributes {
  getGroup: Sequelize.BelongsToGetAssociationMixin<GroupInstance>;
}

export interface UserModel
  extends Sequelize.Model<UserInstance, UserAttributes> {}

export const UserFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): UserModel => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    groupId: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  };

  const User = sequelize.define<UserInstance, UserAttributes>(
    'User',
    attributes
  );

  User.associate = ({ Group }: { Group: GroupModel }) => {
    User.belongsTo(Group);
  };

  return User;
};
