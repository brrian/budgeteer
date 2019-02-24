const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async queryInterface => {
    const groupId = uuid();

    return Promise.all([
      queryInterface.bulkInsert('Groups', [
        {
          id: groupId,
          name: 'Test group',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),

      queryInterface.bulkInsert('Users', [
        {
          id: uuid(),
          groupId,
          name: 'Thomas Tester',
          email: 'test@test.com',
          password: await bcrypt.hash('test', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),

      queryInterface.bulkInsert('Budgets', [
        {
          id: uuid(),
          groupId,
          total: 1164,
          categories: JSON.stringify([
            { id: 17, limit: 350 },
            { id: 35, limit: 200 },
            { id: 14, limit: 90 },
          ]),
          createdAt: '2018-02-09 09:04:00',
          updatedAt: '2018-02-09 09:04:00',
        },
      ]),

      queryInterface.bulkInsert('Categories', [
        {
          id: uuid(),
          groupId,
          categories: JSON.stringify({
            3: 'Automotive',
            4: 'Business Miscellaneous',
            8: 'Child/Dependent',
            9: 'Clothing/Shoes',
            10: 'Dues &amp; Subscriptions',
            11: 'Education',
            12: 'Electronics',
            13: 'Entertainment',
            14: 'Gasoline/Fuel',
            15: 'General Merchandise',
            16: 'Gifts',
            17: 'Groceries',
            18: 'Healthcare/Medical',
            19: 'Hobbies',
            20: 'Home Improvement',
            21: 'Home Maintenance',
            25: 'Office Maintenance',
            26: 'Office Supplies',
            27: 'Online Services',
            29: 'Other Expenses',
            30: 'Personal Care',
            35: 'Restaurants',
            36: 'Service Charges/Fees',
            39: 'Travel',
            56: 'Uncategorized',
            900: 'Return',
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),

      queryInterface.bulkInsert('Stash', [
        {
          groupId,
          total: 0,
          months: '{}',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.bulkDelete('Groups', null, {}),
      queryInterface.bulkDelete('Users', null, {}),
    ]);
  },
};
