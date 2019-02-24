module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Budgets', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
      },
      groupId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Groups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      categories: {
        allowNull: false,
        type: Sequelize.JSON,
        defaultValue: '[]',
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
    return queryInterface.dropTable('Budgets');
  },
};
