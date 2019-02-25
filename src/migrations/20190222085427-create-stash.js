module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stash', {
      groupId: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'Groups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      months: {
        allowNull: false,
        type: Sequelize.JSON,
        defaultValue: '{}',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('Stash');
  },
};
